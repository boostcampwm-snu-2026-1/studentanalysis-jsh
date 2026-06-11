import React from 'react'

interface Tab {
  key: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (key: string) => void
}

export default function Tabs({ tabs, value, onChange }: TabsProps) {
  const activeTab = tabs.find(t => t.key === value) ?? tabs[0]

  return (
    <div>
      <div className="border-b border-outline-variant">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`px-6 py-4 text-sm font-semibold tracking-wide transition-colors -mb-px border-b-2 ${
                tab.key === value
                  ? 'text-on-surface border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">{activeTab?.content}</div>
    </div>
  )
}
