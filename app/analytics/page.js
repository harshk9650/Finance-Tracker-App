'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useData } from '@/contexts/DataContext'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import { downloadReport } from '@/utils/export'
import { calculateTotals } from '@/utils/helpers'
import { Download } from 'lucide-react'

export default function AnalyticsPage() {
  const { transactions } = useData()
  const totals = calculateTotals(transactions)

  const handleDownloadReport = () => {
    downloadReport(transactions, totals)
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <button onClick={handleDownloadReport} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Download Report
          </button>
        </div>

        <AnalyticsCharts transactions={transactions} />
      </div>
    </ProtectedRoute>
  )
}
