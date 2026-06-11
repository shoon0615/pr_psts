import { render } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

/* describe('SnackList', () => {
  it('renders list', async () => {
    renderWithProviders(<SnackList />)

    expect(
      await screen.findByText('포카칩')
    ).toBeInTheDocument()
  })
}) */
