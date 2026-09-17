import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Bell, Map, Sun, User } from 'lucide-react'
import { TabBar, type TabKey } from './components/ui/TabBar'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { HomeScreen } from './components/home/HomeScreen'
import { MapScreen } from './components/map/MapScreen'
import { AlertsScreen } from './components/settings/AlertsScreen'
import { ProfileScreen } from './components/settings/ProfileScreen'
import { useProfileStore } from './store/useProfileStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

const tabs = [
  { key: 'today' as const, label: 'Hoy', icon: Sun },
  { key: 'map' as const, label: 'Mapa', icon: Map },
  { key: 'alerts' as const, label: 'Alertas', icon: Bell },
  { key: 'profile' as const, label: 'Perfil', icon: User },
]

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        {activeTab === 'today' && <HomeScreen />}
        {activeTab === 'map' && <MapScreen />}
        {activeTab === 'alerts' && <AlertsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

function App() {
  const onboardingCompleted = useProfileStore((s) => s.onboardingCompleted)

  return (
    <QueryClientProvider client={queryClient}>
      {onboardingCompleted ? <MainApp /> : <OnboardingFlow />}
    </QueryClientProvider>
  )
}

export default App
