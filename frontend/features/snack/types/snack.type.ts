export const brands = [
  { label: '오리온', value: '001' },
  { label: '크라운', value: '002' },
  { label: '해태', value: '003' },
  { label: '롯데', value: '004' },
  { label: '켈로그', value: '005' }
] as const

export const categories = [
  { label: '봉지과자', value: '001' },
  { label: '비스킷', value: '002' },
  { label: '크래커', value: '003' },
  { label: '빼빼로', value: '004' }
] as const

/**
 * @param id 상품 ID
 * @param title 상품명
 * @param brand 브랜드
 * @param price 상품 가격
 * @param contents 상품 설명
 * @param img 상품 이미지(대표)
 */
export interface Snack {
  // id: number
  id: string
  title: string
  brand: string
  price: number
  contents?: string
  img: string
}
