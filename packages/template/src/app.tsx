import { SWRConfig } from 'swr'
import IndexPage from './pages'

function App() {
  return (
    <SWRConfig
      value={
        {
          // fetcher: (i, ii) => {
          //   return fetcher(i, ii)
          // },
        }
      }
    >
      <IndexPage />
    </SWRConfig>
  )
}

export default App
