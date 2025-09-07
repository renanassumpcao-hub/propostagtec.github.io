import React from 'react';
import type { ProposalInputData } from '../types';
import { ProposalType } from '../types';

interface ControlPanelProps {
  data: ProposalInputData;
  setData: React.Dispatch<React.SetStateAction<ProposalInputData>>;
  onPrint: () => void;
  onTypeChange: (type: ProposalType) => void;
}

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-3">
    <label className="block mb-1.5 font-bold text-xs text-gray-700">{label}</label>
    {children}
  </div>
);

const TextInput: React.FC<{
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: keyof ProposalInputData;
  type?: string;
  step?: string;
  isTextArea?: boolean;
}> = ({ value, onChange, name, type = 'text', step, isTextArea = false }) => {
  const commonProps = {
    name,
    value,
    onChange,
    className: 'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#073763] focus:border-[#073763]',
  };
  return isTextArea ? (
    <textarea {...commonProps} rows={3} />
  ) : (
    <input {...commonProps} type={type} step={step} />
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ data, setData, onPrint, onTypeChange }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    // FIX: Add a type guard to safely access the `checked` property for checkbox inputs.
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
        setData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        const { value } = e.target;
        const isNumeric = ['consumoKWH', 'tarifaKWH', 'contaAtual', 'taxaMinima', 'valorInvestimento', 'taxaJurosFinanciamento', 'taxaJurosCartao', 'reajusteEnergia', 'taxaIpca', 'taxaPoupanca', 'fatorCO2', 'co2Arvore', 'numEmpresas', 'numPlacas', 'valorPorPlaca'].includes(name);
        
        let newValue: string | number | boolean = value;
        if(isNumeric) {
            newValue = value === '' ? 0 : parseFloat(value);
        }
        
        setData(prev => ({ ...prev, [name]: newValue }));
    }
  };
  
  const handleContaDeLuzChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    let updatedData = { ...data, [name]: numericValue };

    if (name === 'consumoKWH' || name === 'tarifaKWH') {
        updatedData.contaAtual = (name === 'consumoKWH' ? numericValue : data.consumoKWH) * (name === 'tarifaKWH' ? numericValue : data.tarifaKWH);
    } else if (name === 'contaAtual') {
        if (data.tarifaKWH > 0) {
            updatedData.consumoKWH = numericValue / data.tarifaKWH;
        }
    }
    setData(updatedData);
  };

  return (
    <div className="w-[420px] bg-white p-5 rounded-xl shadow-lg h-fit border-t-8 border-[#073763] print:hidden">
      <h2 className="text-2xl font-bold text-center text-[#073763] mb-4">Gerador de Proposta</h2>
      
      <div className="border-t border-gray-200 pt-3 mt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tipo de Proposta</h3>
        <select name="proposalType" value={data.proposalType} onChange={(e) => onTypeChange(e.target.value as ProposalType)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
            <option value={ProposalType.Business}>Empresarial (Proprietário)</option>
            <option value={ProposalType.BusinessRenter}>Empresarial (Inquilino)</option>
            <option value={ProposalType.Residential}>Residencial (Proprietário)</option>
            <option value={ProposalType.ResidentialRenter}>Residencial (Inquilino)</option>
            <option value={ProposalType.Rural}>Rural</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-3 mt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Dados do Cliente e Consumo</h3>
        <InputGroup label="Nome do Cliente / Empresa"><TextInput name="nomeCliente" value={data.nomeCliente} onChange={handleInputChange} /></InputGroup>
        <InputGroup label="Consumo Médio (kWh)"><TextInput name="consumoKWH" value={data.consumoKWH} onChange={handleContaDeLuzChange} type="number" /></InputGroup>
        <InputGroup label="Tarifa (R$/kWh)"><TextInput name="tarifaKWH" value={data.tarifaKWH} onChange={handleContaDeLuzChange} type="number" step="0.01" /></InputGroup>
        <InputGroup label="Conta de Luz Estimada (R$)"><TextInput name="contaAtual" value={data.contaAtual} onChange={handleContaDeLuzChange} type="number" /></InputGrup
        <InputGroup label="Custo Mínimo (R$)"><TextInput name="taxaMinima" value={data.taxaMinima} onChange={handleInputChange} type="number" /></InputGroup>
      </div>

      <div className="border-t border-gray-200 pt-3 mt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Valor do Investimento e Taxas</h3>
        <InputGroup label="Valor Total do Investimento (R$)"><TextInput name="valorInvestimento" value={data.valorInvestimento} onChange={handleInputChange} type="number" /></InputGroup>
        <InputGroup label="Taxa de Juros Mensal (Financiamento) %"><TextInput name="taxaJurosFinanciamento" value={data.taxaJurosFinanciamento} onChange={handleInputChange} type="number" step="0.01" /></InputGroup>
        <InputGroup label="Taxa de Juros Mensal (Cartão) %"><TextInput name="taxaJurosCartao" value={data.taxaJurosCartao} onChange={handleInputChange} type="number" step="0.01" /></InputGroup>
        {(data.proposalType === ProposalType.ResidentialRenter) && (
            <>
                <InputGroup label="Nº de Placas (p/ Custo Mudança)"><TextInput name="numPlacas" value={data.numPlacas || 0} onChange={handleInputChange} type="number" /></InputGroup>
                <InputGroup label="Valor por Placa (R$)"><TextInput name="valorPorPlaca" value={data.valorPorPlaca || 0} onChange={handleInputChange} type="number" /></InputGroup>
            </>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 mt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Parâmetros Financeiros e Ambientais</h3>
        <InputGroup label="Reajuste Anual Energia (%)"><TextInput name="reajusteEnergia" value={data.reajusteEnergia} onChange={handleInputChange} type="number" /></InputGroup>
        <InputGroup label="Rentabilidade Tesouro/CDB (% a.a.)"><TextInput name="taxaIpca" value={data.taxaIpca} onChange={handleInputChange} type="number" /></InputGroup>
        <InputGroup label="Rentabilidade Poupança (% a.a.)"><TextInput name="taxaPoupanca" value={data.taxaPoupanca} onChange={handleInputChange} type="number" /></InputGroup>
        <InputGroup label="Fator de Emissão (t CO₂ / MWh)"><TextInput name="fatorCO2" value={data.fatorCO2} onChange={handleInputChange} type="number" step="0.001" /></InputGroup>
        <InputGroup label="CO₂ absorvido por árvore/ano (t)"><TextInput name="co2Arvore" value={data.co2Arvore} onChange={handleInputChange} type="number" step="0.001" /></InputGroup>
      </div>

      <div className="border-t border-gray-200 pt-3 mt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Dados da Empresa e Opções</h3>
        <InputGroup label="Link do WhatsApp"><TextInput name="linkWhatsapp" value={data.linkWhatsapp} onChange={handleInputChange} /></InputGroup>
        <InputGroup label="Nº Contato (para proposta sem CTA)"><TextInput name="contatoAlternativo" value={data.contatoAlternativo} onChange={handleInputChange} /></InputGroup>
        <InputGroup label="Nº de Clientes Atendidos"><TextInput name="numEmpresas" value={data.numEmpresas} onChange={handleInputChange} type="number" /></InputGroup>
        <InputGroup label="Depoimento Cliente"><TextInput name="depoimento" value={data.depoimento} onChange={handleInputChange} isTextArea={true} /></InputGroup>
        <div className="flex items-center gap-2">
            <input type="checkbox" id="incluirCtaFinal" name="incluirCtaFinal" checked={data.incluirCtaFinal} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-[#38761d] focus:ring-[#38761d]" />
            <label htmlFor="incluirCtaFinal" className="text-xs font-bold text-gray-700">Incluir Seção 'Agende sua Visita' no PDF?</label>
        </div>
      </div>
      
      <div className="mt-6">
        <button onClick={onPrint} className="w-full py-3.5 px-4 bg-[#38761d] text-white rounded-lg font-extrabold text-base cursor-pointer hover:bg-green-800 transition-colors">
          <i className="fa-solid fa-print mr-2"></i> Gerar PDF da Proposta
        </button>
      </div>
    </div>
  );
};