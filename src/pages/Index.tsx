import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';

interface YearData {
  year: number;
  withoutCatch: number;
  withCatch: number;
  catchAmount: number;
}

const Index = () => {
  const [initialStock, setInitialStock] = useState(1000);
  const [growthRate, setGrowthRate] = useState(12);
  const [catchPlan, setCatchPlan] = useState(189);
  const [minStock, setMinStock] = useState(250);

  const tableData = useMemo<YearData[]>(() => {
    const data: YearData[] = [];
    let currentStock = initialStock;

    for (let year = 1; year <= 20; year++) {
      const withoutCatch = currentStock * (1 + growthRate / 100);
      const withCatch = Math.max(0, withoutCatch - catchPlan);

      data.push({
        year,
        withoutCatch: Math.round(withoutCatch * 10) / 10,
        withCatch: Math.round(withCatch * 10) / 10,
        catchAmount: catchPlan,
      });

      currentStock = withCatch;
    }

    return data;
  }, [initialStock, growthRate, catchPlan]);

  const criticalYear = useMemo(() => {
    return tableData.findIndex(d => d.withCatch < minStock) + 1;
  }, [tableData, minStock]);

  const safeYears = criticalYear > 0 ? criticalYear - 1 : 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Модель динамики популяций
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Исследование развития биосистем с учетом роста и отлова промысловых рыб
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Settings" size={24} className="text-primary" />
                Параметры модели
              </CardTitle>
              <CardDescription>Настройте начальные условия</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Запас рыбы (т)</Label>
                <Input
                  type="number"
                  value={initialStock}
                  onChange={(e) => setInitialStock(Number(e.target.value))}
                  className="text-lg"
                />
                <Slider
                  value={[initialStock]}
                  onValueChange={([v]) => setInitialStock(v)}
                  min={100}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Ежегодный прирост (%)</Label>
                <Input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="text-lg"
                />
                <Slider
                  value={[growthRate]}
                  onValueChange={([v]) => setGrowthRate(v)}
                  min={1}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">План отлова (т)</Label>
                <Input
                  type="number"
                  value={catchPlan}
                  onChange={(e) => setCatchPlan(Number(e.target.value))}
                  className="text-lg"
                />
                <Slider
                  value={[catchPlan]}
                  onValueChange={([v]) => setCatchPlan(v)}
                  min={50}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Критический минимум (т)</Label>
                <Input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className="text-lg"
                />
                <Slider
                  value={[minStock]}
                  onValueChange={([v]) => setMinStock(v)}
                  min={100}
                  max={500}
                  step={50}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={24} className="text-secondary" />
                График динамики популяции
              </CardTitle>
              <CardDescription>Изменение численности за 20 лет</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={tableData}>
                  <defs>
                    <linearGradient id="colorWithCatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorWithoutCatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Год', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Запас рыбы (т)', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <ReferenceLine 
                    y={minStock} 
                    stroke="#F97316" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    label={{ value: 'Критический минимум', fill: '#F97316', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="withoutCatch"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorWithoutCatch)"
                    name="Без отлова"
                  />
                  <Area
                    type="monotone"
                    dataKey="withCatch"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWithCatch)"
                    name="С отловом"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {criticalYear > 0 && (
          <Alert className="border-2 border-accent bg-accent/10">
            <Icon name="AlertTriangle" size={20} className="text-accent" />
            <AlertDescription className="text-base font-semibold">
              Внимание! На {criticalYear}-й год популяция опускается ниже критического минимума ({minStock} т).
              Можно безопасно вести отлов в течение {safeYears} {safeYears === 1 ? 'года' : 'лет'}.
            </AlertDescription>
          </Alert>
        )}

        {criticalYear === 0 && (
          <Alert className="border-2 border-green-500 bg-green-50">
            <Icon name="CheckCircle2" size={20} className="text-green-600" />
            <AlertDescription className="text-base font-semibold text-green-800">
              Популяция устойчива! При текущих параметрах отлов можно вести неограниченно долго.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-100">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Table" size={24} className="text-primary" />
              Таблица динамики популяции
            </CardTitle>
            <CardDescription>Подробные расчеты на 20 лет</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/20 to-secondary/20">
                    <th className="border-2 border-gray-300 p-3 text-left font-bold">Год</th>
                    <th className="border-2 border-gray-300 p-3 text-left font-bold">
                      Прирост {growthRate}%
                    </th>
                    <th className="border-2 border-gray-300 p-3 text-left font-bold">
                      Кол-во без отлова (т)
                    </th>
                    <th className="border-2 border-gray-300 p-3 text-left font-bold">
                      Отлов (т)
                    </th>
                    <th className="border-2 border-gray-300 p-3 text-left font-bold">
                      Кол-во с отловом (т)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border-2 border-gray-300 p-3">0</td>
                    <td className="border-2 border-gray-300 p-3">-</td>
                    <td className="border-2 border-gray-300 p-3">{initialStock}</td>
                    <td className="border-2 border-gray-300 p-3">-</td>
                    <td className="border-2 border-gray-300 p-3">{initialStock}</td>
                  </tr>
                  {tableData.map((row, idx) => {
                    const isCritical = row.withCatch < minStock;
                    return (
                      <tr 
                        key={row.year}
                        className={isCritical ? 'bg-red-100 font-semibold' : idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="border-2 border-gray-300 p-3">{row.year}</td>
                        <td className="border-2 border-gray-300 p-3">{growthRate}%</td>
                        <td className="border-2 border-gray-300 p-3">{row.withoutCatch}</td>
                        <td className="border-2 border-gray-300 p-3">{row.catchAmount}</td>
                        <td className={`border-2 border-gray-300 p-3 ${isCritical ? 'text-red-700 font-bold' : ''}`}>
                          {row.withCatch}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Info" size={24} className="text-primary" />
              О модели
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              <strong>Модель неограниченного роста с отловом</strong> позволяет изучать динамику
              численности популяций промысловых рыб с учетом ежегодного прироста и отлова.
            </p>
            <p>
              <strong>Формула расчета:</strong> Количество рыбы в году N = (Количество в году N-1) × (1 + Прирост%) - Отлов
            </p>
            <p>
              <strong>Критический минимум</strong> — это наименьший запас рыбы, при котором популяция
              становится невосостановимой. Если запас опускается ниже этого уровня, популяция деградирует.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
