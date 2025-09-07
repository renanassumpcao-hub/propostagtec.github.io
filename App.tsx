
import React, { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ProposalView } from './components/ProposalView';
import { useProposalCalculations } from './hooks/useProposalCalculations';
import { ProposalType } from './types';
import type { ProposalInputData } from './types';

const PROPOSAL_DEFAULTS: Record<ProposalType, ProposalInputData> = {
  [ProposalType.Business]: {
    proposalType: ProposalType.Business,
    nomeCliente: "[Nome da Empresa]",
    consumoKWH: 3500, tarifaKWH: 0.96, contaAtual: 3360, taxaMinima: 250,
    valorInvestimento: 85000, taxaJurosFinanciamento: 1.89, taxaJurosCartao: 17.90,
    reajusteEnergia: 6, taxaIpca: 10, taxaPoupanca: 6,
    fatorCO2: 0.038, co2Arvore: 0.022,
    linkWhatsapp: "https://wa.me/5569993291920", contatoAlternativo: "69 99329-1920",
    numEmpresas: 22,
    depoimento: `"O investimento na usina solar foi a melhor decisão estratégica que tomamos. Reduzimos um custo enorme, o que nos deu fôlego para expandir a operação." - Diretor, Supermercado`,
    incluirCtaFinal: true,
  },
  [ProposalType.BusinessRenter]: {
    proposalType: ProposalType.BusinessRenter,
    nomeCliente: "[Nome da Empresa Inquilina]",
    consumoKWH: 3500, tarifaKWH: 0.96, contaAtual: 3360, taxaMinima: 250,
    valorInvestimento: 85000, taxaJurosFinanciamento: 1.89, taxaJurosCartao: 17.90,
    reajusteEnergia: 6, taxaIpca: 10, taxaPoupanca: 6,
    fatorCO2: 0.038, co2Arvore: 0.022,
    linkWhatsapp: "https://wa.me/5569993291920", contatoAlternativo: "69 99329-1920",
    numEmpresas: 22,
    depoimento: `"Como inquilinos, sempre hesitamos em fazer grandes investimentos no imóvel. A GTECH nos mostrou que a usina solar é um ativo nosso, que podemos levar conosco." - Sócio-Diretor, Indústria`,
    incluirCtaFinal: true,
  },
  [ProposalType.Residential]: {
    proposalType: ProposalType.Residential,
    nomeCliente: "[Nome do Cliente]",
    consumoKWH: 1800, tarifaKWH: 0.96, contaAtual: 1728, taxaMinima: 120,
    valorInvestimento: 45000, taxaJurosFinanciamento: 1.89, taxaJurosCartao: 17.90,
    reajusteEnergia: 6, taxaIpca: 10, taxaPoupanca: 6,
    fatorCO2: 0.038, co2Arvore: 0.022,
    linkWhatsapp: "https://wa.me/5569993291920", contatoAlternativo: "69 99329-1920",
    numEmpresas: 85,
    depoimento: `"Nossa casa é outra depois da GTEC. Usamos os ares-condicionados sem peso na consciência... A paz de viver sem se assustar com a conta de luz não tem preço." - Cliente, Porto Velho`,
    incluirCtaFinal: true,
  },
  [ProposalType.ResidentialRenter]: {
    proposalType: ProposalType.ResidentialRenter,
    nomeCliente: "[Nome do Inquilino]",
    consumoKWH: 800, tarifaKWH: 0.96, contaAtual: 768, taxaMinima: 150,
    valorInvestimento: 16632, taxaJurosFinanciamento: 1.89, taxaJurosCartao: 17.90,
    numPlacas: 12, valorPorPlaca: 150,
    reajusteEnergia: 6, taxaIpca: 10.5, taxaPoupanca: 6.17,
    fatorCO2: 0.038, co2Arvore: 0.022,
    linkWhatsapp: "https://wa.me/5569993291920", contatoAlternativo: "69 99329-1920",
    numEmpresas: 47,
    depoimento: `"Eu achava que, por morar de aluguel, estava refém da conta de luz. A equipe mudou isso. Comprei minha usina, e na minha última mudança, eles cuidaram de todo o processo." - Marcos R., Inquilino`,
    incluirCtaFinal: true,
  },
  [ProposalType.Rural]: {
    proposalType: ProposalType.Rural,
    nomeCliente: "[Nome do Cliente / Propriedade]",
    consumoKWH: 3500, tarifaKWH: 0.96, contaAtual: 3360, taxaMinima: 250,
    valorInvestimento: 85000, taxaJurosFinanciamento: 1.89, taxaJurosCartao: 17.90,
    reajusteEnergia: 6, taxaIpca: 10, taxaPoupanca: 6,
    fatorCO2: 0.038, co2Arvore: 0.022,
    linkWhatsapp: "https://wa.me/5569993291920", contatoAlternativo: "69 99329-1920",
    numEmpresas: 27,
    depoimento: `"Depois que o resfriador de leite parou por falta de energia e quase perdi a produção do dia, decidi investir. Hoje, não tenho mais essa dor de cabeça." - José da Silva, Produtor de Leite`,
    incluirCtaFinal: true,
  },
};


function App() {
  const [inputData, setInputData] = useState<ProposalInputData>(PROPOSAL_DEFAULTS[ProposalType.Business]);
  const calculatedData = useProposalCalculations(inputData);

  const handleTypeChange = useCallback((type: ProposalType) => {
    const defaults = PROPOSAL_DEFAULTS[type];
    const newContaAtual = defaults.consumoKWH * defaults.tarifaKWH;
    setInputData({ ...defaults, contaAtual: newContaAtual });
  }, []);
  
  const handlePrint = () => {
    window.print();
  };
  
  useEffect(() => {
    handleTypeChange(ProposalType.Business);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-6 p-6 font-['Montserrat',sans-serif] text-[#333]">
      <ControlPanel data={inputData} setData={setInputData} onPrint={handlePrint} onTypeChange={handleTypeChange} />
      <ProposalView inputs={inputData} calcs={calculatedData} />
    </div>
  );
}

export default App;
