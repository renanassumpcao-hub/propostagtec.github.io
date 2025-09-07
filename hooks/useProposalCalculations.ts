
import { useMemo } from 'react';
import type { ProposalInputData, CalculatedData } from '../types';

const calcularParcelaPrice = (valorPresente: number, taxaMensal: number, periodos: number): number => {
    if (taxaMensal <= 0 || periodos <= 0) return valorPresente / (periodos || 1);
    const fator = Math.pow(1 + taxaMensal, periodos);
    const parcela = valorPresente * ((taxaMensal * fator) / (fator - 1));
    return parcela;
};

const fv = (pv: number, taxa: number, periodos: number): number => pv * Math.pow(1 + taxa, periodos);

export const useProposalCalculations = (inputs: ProposalInputData): CalculatedData => {
  return useMemo(() => {
    const {
      valorInvestimento,
      contaAtual,
      taxaMinima,
      taxaJurosFinanciamento,
      taxaJurosCartao,
      reajusteEnergia,
      taxaIpca,
      taxaPoupanca,
      consumoKWH,
      fatorCO2,
      co2Arvore,
      numPlacas,
      valorPorPlaca
    } = inputs;

    const dataProposta = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const precoSistema = valorInvestimento || 0;
    const economiaMensal = Math.max(0, (contaAtual || 0) - (taxaMinima || 0));
    const economiaAnualBase = economiaMensal * 12;

    const taxaJurosFinanMensal = (taxaJurosFinanciamento || 0) / 100;
    const taxaJurosCartaoMensal = (taxaJurosCartao || 0) / 100;

    const parcelaFinan60 = calcularParcelaPrice(precoSistema, taxaJurosFinanMensal, 60);
    const parcelaFinan90 = calcularParcelaPrice(precoSistema, taxaJurosFinanMensal, 90);
    const parcelaFinan120 = calcularParcelaPrice(precoSistema, taxaJurosFinanMensal, 120);
    const parcelaCartao24 = calcularParcelaPrice(precoSistema, taxaJurosCartaoMensal, 24);

    let acc = 0;
    let acc10 = 0;
    let paybackReal = 0;
    let eco = economiaAnualBase;
    const reajusteAnual = (reajusteEnergia || 0) / 100;

    for (let ano = 1; ano <= 25; ano++) {
      acc += eco;
      if (ano === 10) acc10 = acc;
      if (acc >= precoSistema && paybackReal === 0) paybackReal = ano;
      eco *= (1 + reajusteAnual);
    }
    const economiaAcumulada10anos = acc10;
    const economiaAcumulada25anos = acc;
    const retornoLiquido25anos = economiaAcumulada25anos - precoSistema;

    const taxaIpcaAnual = (taxaIpca || 0) / 100;
    const taxaPoupancaAnual = (taxaPoupanca || 0) / 100;

    const fvIpca10 = fv(precoSistema, taxaIpcaAnual, 10);
    const fvIpca25 = fv(precoSistema, taxaIpcaAnual, 25);
    const fvPoup10 = fv(precoSistema, taxaPoupancaAnual, 10);
    const fvPoup25 = fv(precoSistema, taxaPoupancaAnual, 25);

    const geracaoAnualMWh = ((consumoKWH || 0) * 12) / 1000;
    const co2EvitadoTotal = (geracaoAnualMWh * (fatorCO2 || 0) * 25).toFixed(2);
    const arvoresSalvasTotal = Math.round((geracaoAnualMWh * (fatorCO2 || 0) * 25) / (co2Arvore || 1));

    const custoReinstalacao = (numPlacas || 0) * (valorPorPlaca || 0);

    return {
      dataProposta,
      precoSistema,
      economiaMensal,
      economiaAnualBase,
      parcelaFinan60,
      parcelaFinan90,
      parcelaFinan120,
      parcelaCartao24,
      paybackReal,
      economiaAcumulada10anos,
      economiaAcumulada25anos,
      retornoLiquido25anos,
      fvIpca10,
      fvIpca25,
      fvPoup10,
      fvPoup25,
      geracaoAnualMWh,
      co2EvitadoTotal,
      arvoresSalvasTotal,
      custoReinstalacao,
    };
  }, [inputs]);
};
