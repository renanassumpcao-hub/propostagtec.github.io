import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
// FIX: The `qrcode.react` library no longer exports a component named `QRCode`.
// Import `QRCodeSVG` and alias it as `QRCode` to fix the module import error.
import { QRCodeSVG as QRCode } from 'qrcode.react';
import type { ProposalInputData, CalculatedData } from '../types';
import { ProposalType } from '../types';

interface ProposalViewProps {
  inputs: ProposalInputData;
  calcs: CalculatedData;
}

const formatCurrency = (value: number) => 
  (isFinite(value) ? value : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Section: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`mb-9 pb-7 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 ${className}`}>
    {title && <h2 className="text-2xl font-bold text-[#073763] border-l-8 border-[#073763] pl-4 mb-6">{title}</h2>}
    {children}
  </section>
);

const KpiCard: React.FC<{ icon: string; label: string; value: string | number; isGreen?: boolean; }> = ({ icon, label, value, isGreen }) => (
  <div className={`rounded-xl p-4 text-center shadow-sm ${isGreen ? 'bg-green-50 border-2 border-[#38761d]' : 'bg-[#edf2f7]'}`}>
    <i className={`text-3xl mb-2 ${isGreen ? 'text-[#38761d]' : 'text-[#073763]'} ${icon}`}></i>
    <div className="text-xs tracking-wider uppercase text-gray-600 font-extrabold">{label}</div>
    <div className={`text-3xl font-black mt-1.5 ${isGreen ? 'text-[#38761d]' : 'text-[#073763]'}`}>{value}</div>
  </div>
);

const GuaranteeCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <i className={`text-3xl text-[#073763] mb-2 ${icon}`}></i>
        <div className="text-4xl font-black text-[#073763] my-1.5">{title}</div>
        <p className="text-sm text-gray-700">{children}</p>
    </div>
);

const InvestmentDetails: React.FC<{ calcs: CalculatedData, inputs: ProposalInputData }> = ({ calcs, inputs }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 items-start">
    <div className="valor-investimento">
      <h3 className="text-xl font-bold text-[#073763]">Valor do Investimento (à vista)</h3>
      <p className="text-4xl font-black text-[#073763] my-2">{formatCurrency(calcs.precoSistema)}</p>
      <small className="text-gray-600 text-xs">Este valor contempla todos os equipamentos, projeto, instalação e homologação.</small>
    </div>
    <div className="bg-gray-100 rounded-xl p-4">
      <h4 className="text-lg font-bold text-center text-[#073763] mb-3">Simulação de Parcelamento</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between p-2.5 border-b border-gray-200"><span className="font-bold">Financiamento em 60x</span> <span className="text-[#38761d] text-lg font-bold">{formatCurrency(calcs.parcelaFinan60)}</span></div>
        <div className="flex justify-between p-2.5 border-b border-gray-200"><span className="font-bold">Financiamento em 90x</span> <span className="text-[#38761d] text-lg font-bold">{formatCurrency(calcs.parcelaFinan90)}</span></div>
        <div className="flex justify-between p-2.5 border-b border-gray-200"><span className="font-bold">Financiamento em 120x</span> <span className="text-[#38761d] text-lg font-bold">{formatCurrency(calcs.parcelaFinan120)}</span></div>
        <div className="flex justify-between p-2.5"><span className="font-bold">Cartão de Crédito em 24x</span> <span className="text-[#38761d] text-lg font-bold">{formatCurrency(calcs.parcelaCartao24)}</span></div>
      </div>
    </div>
  </div>
);

const FinancialChart: React.FC<{ calcs: CalculatedData }> = ({ calcs }) => {
    const chartData = [
        { name: '10 Anos', 'Energia Solar': calcs.economiaAcumulada10anos, 'Tesouro/CDB': calcs.fvIpca10, 'Poupança': calcs.fvPoup10 },
        { name: '25 Anos', 'Energia Solar': calcs.economiaAcumulada25anos, 'Tesouro/CDB': calcs.fvIpca25, 'Poupança': calcs.fvPoup25 },
    ];
    return (
        <div className="bg-gray-100 rounded-xl p-4">
            <div className="w-full h-64">
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="Energia Solar" fill="#38761d" />
                        <Bar dataKey="Tesouro/CDB" fill="#073763" />
                        <Bar dataKey="Poupança" fill="#6b7280" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <table className="w-full mt-4 border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300">Projeção</th>
                        <th className="p-2 border border-gray-300">Retorno com Energia Solar</th>
                        <th className="p-2 border border-gray-300">Tesouro/CDB</th>
                        <th className="p-2 border border-gray-300">Poupança</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border border-gray-300 text-center"><b>10 Anos</b></td>
                        <td className="p-2 border border-gray-300 text-center font-bold text-[#38761d]">{formatCurrency(calcs.economiaAcumulada10anos)}</td>
                        <td className="p-2 border border-gray-300 text-center">{formatCurrency(calcs.fvIpca10)}</td>
                        <td className="p-2 border border-gray-300 text-center">{formatCurrency(calcs.fvPoup10)}</td>
                    </tr>
                    <tr>
                        <td className="p-2 border border-gray-300 text-center"><b>25 Anos</b></td>
                        <td className="p-2 border border-gray-300 text-center font-bold text-[#38761d]">{formatCurrency(calcs.economiaAcumulada25anos)}</td>
                        <td className="p-2 border border-gray-300 text-center">{formatCurrency(calcs.fvIpca25)}</td>
                        <td className="p-2 border border-gray-300 text-center">{formatCurrency(calcs.fvPoup25)}</td>
                    </tr>
                </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2 text-center">Nota: A rentabilidade de investimentos como Tesouro e Poupança é projetada com o Imposto de Renda já descontado para uma comparação justa.</p>
        </div>
    );
};

const CtaSection: React.FC<{ inputs: ProposalInputData }> = ({ inputs }) => (
    <>
      <div id="contato-alternativo" className={inputs.incluirCtaFinal ? 'hidden' : 'block mt-8 text-center text-lg'}>
        <p>Para agendar a visita ou tirar dúvidas, entre em contato:</p>
        <a href={`https://wa.me/55${inputs.contatoAlternativo.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#073763] font-bold">
          WhatsApp {inputs.contatoAlternativo}
        </a>
      </div>
      <div id="cta-final-wrapper" className={!inputs.incluirCtaFinal ? 'print:hidden' : ''}>
        <Section title="AGENDE SUA VISITA TÉCNICA">
          <div className="text-center">
            <p className="max-w-2xl mx-auto mb-6">Com a proposta pré-aprovada, o próximo passo é agendar a visita. Clique no botão ou escaneie o QR Code para falar com nosso especialista e marcar o melhor dia e horário.</p>
            <a href={inputs.linkWhatsapp} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] text-white py-4 px-8 rounded-full text-xl font-black shadow-lg hover:translate-y-[-2px] transition-transform">
              <i className="fab fa-whatsapp mr-2"></i> Agendar Visita Técnica
            </a>
            <div className="mt-4 inline-block">
                {inputs.linkWhatsapp && <QRCode value={inputs.linkWhatsapp} size={200} />}
            </div>
          </div>
        </Section>
      </div>
    </>
);

const SocialProof: React.FC<{ numClients: number; depoimento: string; type: 'empresa' | 'família' | 'propriedade'; images: string[] }> = ({ numClients, depoimento, type, images }) => (
    <Section title="Nossa Experiência a Serviço do Seu Negócio">
        <p className="text-center text-lg font-bold">✅ Mais de {numClients} {type}s em Rondônia já otimizam seus custos conosco.</p>
        <div className="grid grid-cols-3 gap-2.5 my-5">
            {images.map((src, index) => <img key={index} src={src} alt={`instalação ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-md" />)}
        </div>
        <blockquote className="text-center italic text-base mt-5 p-4 bg-gray-100 border-l-4 border-gray-300">"{depoimento}"</blockquote>
    </Section>
);

// --- TEMPLATES ---

const CoverPage: React.FC<{ inputs: ProposalInputData; calcs: CalculatedData; title: string; subtitle?: string; }> = ({ inputs, calcs, title, subtitle }) => (
  <Section className="text-center h-[90vh] flex flex-col justify-center items-center border-b-0 page-break">
    <img src="https://i.imgur.com/1AhMp9y.png" alt="Logo GTECH" className="max-w-[250px] mb-10" />
    <h1 className="text-4xl font-black text-[#073763]">{title}</h1>
    {subtitle && <h2 className="text-2xl mt-2">{subtitle}</h2>}
    <p className="text-xl mt-8">Preparada para: <strong>{inputs.nomeCliente}</strong></p>
    <p>Data: {calcs.dataProposta}</p>
  </Section>
);

const Hero: React.FC<{title: string; subtitle: string; value: string}> = ({title, subtitle, value}) => (
    <Section className="bg-gradient-to-br from-[#073763] to-[#0b4c8a] text-white text-center -mx-10 -mt-10 mb-10 p-12 rounded-b-2xl shadow-lg">
        <h1 className="text-4xl font-black leading-tight">{title}</h1>
        <p className="text-xl mt-4 max-w-3xl mx-auto">{subtitle}</p>
        <p className="mt-6 text-lg">Retorno Líquido Projetado: <strong className="text-4xl font-black text-[#92e625] block">{value}</strong></p>
    </Section>
);

const BusinessTemplate: React.FC<ProposalViewProps> = ({ inputs, calcs }) => {
    return <>
        <CoverPage inputs={inputs} calcs={calcs} title="Proposta de Investimento em" subtitle="Usina Fotovoltaica" />
        <Hero title="TRANSFORME SEU CUSTO DE ENERGIA EM UM ATIVO ESTRATÉGICO" subtitle="Aumente sua margem de lucro, blinde seu caixa contra a inflação energética e ganhe previsibilidade orçamentária para os próximos 25 anos." value={formatCurrency(calcs.retornoLiquido25anos)}/>
        
        <Section title="Dashboard Executivo: Análise de Viabilidade">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard icon="fa-solid fa-file-invoice-dollar" label="Custo Operacional (Energia)" value={formatCurrency(inputs.contaAtual)} />
                <KpiCard icon="fa-solid fa-arrows-left-right-to-line" label="Custo Pós-Investimento" value={formatCurrency(inputs.taxaMinima)} />
                <KpiCard icon="fa-solid fa-arrow-down-wide-short" label="Redução Imediata de Custo" value={formatCurrency(calcs.economiaMensal)} isGreen />
                <KpiCard icon="fa-solid fa-sack-dollar" label="Lucro Líquido (25 anos)" value={formatCurrency(calcs.retornoLiquido25anos)} isGreen />
                <KpiCard icon="fa-solid fa-chart-line" label="Payback do Investimento" value={`${calcs.paybackReal} anos`} isGreen />
                <KpiCard icon="fa-solid fa-shield-halved" label="Garantia de Performance" value="25 anos" isGreen />
            </div>
        </Section>
    </>
};

const RuralTemplate: React.FC<ProposalViewProps> = ({ inputs, calcs }) => {
    return <>
        <CoverPage inputs={inputs} calcs={calcs} title="Proposta de Investimento em" subtitle="Autonomia Energética Rural" />
        <Hero title="BLINDE SUA PROPRIEDADE CONTRA OS AUMENTOS E QUEDAS DE ENERGIA" subtitle="Aumente a margem de lucro da sua produção, blinde seu caixa contra a inflação energética e ganhe previsibilidade de custos para os próximos 25 anos." value={formatCurrency(calcs.retornoLiquido25anos)} />
        <Section title="Sua Propriedade em Números: Panorama Financeiro">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard icon="fa-solid fa-file-invoice-dollar" label="Custo Atual com Energia" value={formatCurrency(inputs.contaAtual)} />
                <KpiCard icon="fa-solid fa-arrows-left-right-to-line" label="Fatura Pós Investimento" value={formatCurrency(inputs.taxaMinima)} />
                <KpiCard icon="fa-solid fa-arrow-down-wide-short" label="Lucro Mensal Imediato" value={formatCurrency(calcs.economiaMensal)} isGreen />
                <KpiCard icon="fa-solid fa-sack-dollar" label="Lucro Líquido (25 anos)" value={formatCurrency(calcs.retornoLiquido25anos)} isGreen />
                <KpiCard icon="fa-solid fa-chart-line" label="Payback do Investimento" value={`${calcs.paybackReal} anos`} isGreen />
                <KpiCard icon="fa-solid fa-shield-halved" label="Garantia de Geração" value="25 anos" isGreen />
            </div>
        </Section>
    </>
};

const ResidentialTemplate: React.FC<ProposalViewProps> = ({ inputs, calcs }) => {
    return <>
        <CoverPage inputs={inputs} calcs={calcs} title="Proposta de Autonomia e" subtitle="Conforto Energético" />
        <Hero title="A LIBERDADE DE VIVER O MÁXIMO DO SEU LAR, SEM SE PREOCUPAR COM A CONTA DE LUZ" subtitle="Ligue todos os ares-condicionados, aqueça sua piscina e desfrute de cada momento. Sua casa, suas regras. A energia? Deixa que o sol paga." value={formatCurrency(calcs.retornoLiquido25anos)} />
        <Section title="Raio-X do Seu Novo Estilo de Vida">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard icon="fa-solid fa-bolt" label="Consumo Médio Mensal" value={`${inputs.consumoKWH.toFixed(0)} kWh`} />
                <KpiCard icon="fa-solid fa-file-invoice-dollar" label="Sua Conta de Luz Atual" value={formatCurrency(inputs.contaAtual)} />
                <KpiCard icon="fa-solid fa-plug-circle-check" label="Nova Conta de Luz" value={formatCurrency(inputs.taxaMinima)} />
                <KpiCard icon="fa-solid fa-arrow-down-wide-short" label="Economia Mensal Imediata" value={formatCurrency(calcs.economiaMensal)} isGreen />
            </div>
        </Section>
    </>
};

const RenterTemplate: React.FC<ProposalViewProps> = ({ inputs, calcs }) => {
    return <>
        <CoverPage inputs={inputs} calcs={calcs} title="Estudo Preliminar de Economia" subtitle="para Inquilinos" />
        <Hero title="SUA PRÓPRIA USINA DE ENERGIA, ONDE QUER QUE VOCÊ MORE." subtitle="A economia que acompanha você a cada mudança. Chegou a sua independência energética, mesmo morando de aluguel." value={formatCurrency(calcs.retornoLiquido25anos)} />
        <Section title="Dashboard de Viabilidade">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard icon="fa-solid fa-file-invoice-dollar" label="Sua Conta Atual" value={formatCurrency(inputs.contaAtual)} />
                <KpiCard icon="fa-solid fa-solar-panel" label="Sua Nova Conta" value={formatCurrency(inputs.taxaMinima)} isGreen/>
                <KpiCard icon="fa-solid fa-piggy-bank" label="Economia no Bolso" value={formatCurrency(calcs.economiaMensal)} isGreen/>
                <KpiCard icon="fa-solid fa-sack-dollar" label="Lucro Líquido (25 anos)" value={formatCurrency(calcs.retornoLiquido25anos)} isGreen />
                <KpiCard icon="fa-solid fa-chart-line" label="Payback do Ativo" value={`${calcs.paybackReal} anos`} isGreen />
                <KpiCard icon="fa-solid fa-truck-fast" label="Custo Médio de Mudança" value={formatCurrency(calcs.custoReinstalacao || 0)} />
            </div>
             <p className="text-xs text-gray-500 text-center mt-4"><b>Atenção:</b> Estes números são uma estimativa inicial. A proposta oficial com garantia de economia é formalizada após a visita técnica.</p>
        </Section>
    </>
};


export const ProposalView: React.FC<ProposalViewProps> = ({ inputs, calcs }) => {

    const renderTemplateHeader = () => {
        switch (inputs.proposalType) {
            case ProposalType.Business:
            case ProposalType.BusinessRenter:
                return <BusinessTemplate inputs={inputs} calcs={calcs} />;
            case ProposalType.Rural:
                return <RuralTemplate inputs={inputs} calcs={calcs} />;
            case ProposalType.Residential:
                return <ResidentialTemplate inputs={inputs} calcs={calcs} />;
            case ProposalType.ResidentialRenter:
                return <RenterTemplate inputs={inputs} calcs={calcs} />;
            default:
                return <div>Selecione um tipo de proposta</div>;
        }
    };
    
    return (
        <div className="flex-grow bg-white p-10 shadow-lg max-w-4xl rounded-xl">
            {renderTemplateHeader()}
            
            <Section title="Investimento e Condições de Pagamento">
                <InvestmentDetails calcs={calcs} inputs={inputs}/>
            </Section>
            
            <Section title="Análise Financeira: Seu Investimento em Detalhes">
                <FinancialChart calcs={calcs}/>
            </Section>

            <Section title="Garantia Tripla de Segurança para seu Investimento">
                <div className="flex flex-col md:flex-row gap-4 text-center">
                    <GuaranteeCard icon="fa-solid fa-gauge" title="Geração">
                        Garantia de que o sistema irá gerar a energia projetada. Performance e eficiência asseguradas em contrato.
                    </GuaranteeCard>
                    <GuaranteeCard icon="fa-solid fa-microchip" title="Equipamento">
                        Trabalhamos apenas com equipamentos Tier 1, com até 25 anos de garantia de fábrica contra defeitos.
                    </GuaranteeCard>
                    <GuaranteeCard icon="fa-solid fa-helmet-safety" title="Instalação">
                        Nossa equipe técnica garante uma instalação segura e eficiente, seguindo todas as normas de engenharia.
                    </GuaranteeCard>
                </div>
            </Section>

            <SocialProof 
                numClients={inputs.numEmpresas} 
                depoimento={inputs.depoimento} 
                type="família" 
                images={["https://i.imgur.com/x8JN1QF.png", "https://i.imgur.com/G3Uu9qA.png", "https://i.imgur.com/2diPFpa.png"]}
            />

            <CtaSection inputs={inputs}/>
        </div>
    );
};