import { render, screen, waitFor } from '@testing-library/react'
import { ProtoList } from '@/features/proto/components/list'
// import { } from '@/'

describe('ProtoList', () => {
  /** test | it 은 동일한 기능 제공 */
  test('하드코딩 테스트', async () => {
    render(<ProtoList />)
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('하드코딩 테스트', async () => {
    render(<ProtoList />)
    expect(screen.getByText('234')).toBeInTheDocument()
  })

  it('Mock 테스트', async () => {
    render(<ProtoList />)
    await waitFor(() => {
      expect(screen.getByText('포카칩')).toBeInTheDocument()
    })
  })
})
