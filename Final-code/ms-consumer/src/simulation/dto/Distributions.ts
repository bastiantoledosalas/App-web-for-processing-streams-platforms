
// Definimos las distribuciones posibles para `avgServiceTimeType`
export enum DistributionTypeAvgServiceTime{
  SPLINE = 'spline',
  FIXED = 'fixed',
  CHI2 = 'chi2',
  MAXWELL = 'maxwell',
  EXPON = 'expon',
  INVGAUSS = 'invgauss',
  NORM = 'norm',
  LOGNORM = 'lognorm',
}

export enum NumberOutputTweetsType{
  SPLINE = 'spline',
  FIXED = 'fixed',
  BERNOULLI='bernoulli',
  GEOM='geom',
  NBINOM='nbinom'
}
