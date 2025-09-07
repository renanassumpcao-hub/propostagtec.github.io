
export enum ProposalType {
  Business = 'Business',
  BusinessRenter = 'BusinessRenter',
  Residential = 'Residential',
  ResidentialRenter = 'ResidentialRenter',
  Rural = 'Rural',
}

export interface ProposalInputData {
  // Client & Consumption
  proposalType: ProposalType;
  nomeCliente: string;
  consumoKWH: number;
  tarifaKWH: number;
  contaAtual: number;
  taxaMinima: number;

  // Investment
  valorInvestimento: number;
  taxaJurosFinanciamento: number; // Monthly %
  taxaJurosCartao: number; // Monthly %
  
  // Renter Specific
  numPlacas?: number;
  valorPorPlaca?: number;

  // Projections
  reajusteEnergia: number; // Annual %
  taxaIpca: number; // Annual %
  taxaPoupanca: number; // Annual %
  
  // Environmental
  fatorCO2: number;
  co2Arvore: number;

  // Company & Options
  linkWhatsapp: string;
  contatoAlternativo: string;
  numEmpresas: number;
  depoimento: string;
  incluirCtaFinal: boolean;
}

export interface CalculatedData {
    dataProposta: string;
    precoSistema: number;
    economiaMensal: number;
    economiaAnualBase: number;
    parcelaFinan60: number;
    parcelaFinan90: number;
    parcelaFinan120: number;
    parcelaCartao24: number;
    paybackReal: number;
    economiaAcumulada10anos: number;
    economiaAcumulada25anos: number;
    retornoLiquido25anos: number;
    fvIpca10: number;
    fvIpca25: number;
    fvPoup10: number;
    fvPoup25: number;
    geracaoAnualMWh: number;
    co2EvitadoTotal: string;
    arvoresSalvasTotal: number;
    custoReinstalacao?: number;
}
