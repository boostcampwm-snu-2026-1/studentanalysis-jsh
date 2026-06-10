interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="text-sm text-on-surface-variant px-3 py-1 rounded hover:bg-surface-container disabled:opacity-30"
      >
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`text-sm px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-primary text-on-primary font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="text-sm text-on-surface-variant px-3 py-1 rounded hover:bg-surface-container disabled:opacity-30"
      >
        다음
      </button>
    </div>
  )
}
