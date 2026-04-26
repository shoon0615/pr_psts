'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/custom/separator'
import qrImage from '@/.gemini/image.png'

export default function SnackDetail() {
  const params = useParams()
  const id = params.id

  // 임시 데이터 (실제 연동 시 useSnack(id) 등으로 대체 가능)
  const snack = {
    title: `Snack Item ${id}`,
    price: '15,000원',
    contents: '맛있는 스낵의 짧은 요약 정보입니다.',
    description: `이 상품은 최고급 재료만을 사용하여 만든 특별한 스낵입니다. 
    바삭한 식감과 깊은 풍미를 동시에 느낄 수 있으며, 언제 어디서나 간편하게 즐기기 좋습니다. 
    상세한 제조 공정부터 원산지까지 꼼꼼하게 관리하여 믿고 드실 수 있습니다.`,
    details: {
      origin: '국내산 100%',
      weight: '250g',
      calories: '450kcal',
      expiration: '제조일로부터 6개월'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Product Image */}
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardContent className="p-0">
              <div className="relative aspect-square w-full bg-gray-50">
                <Image
                  src={qrImage}
                  alt={snack.title}
                  fill
                  className="object-contain p-12 transition-transform duration-500 hover:scale-105"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Product Info & Hover Interaction */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge
              variant="outline"
              className="mb-2">
              New Collection
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {snack.title}
            </h1>
            <p className="text-primary mt-4 text-2xl font-bold">
              {snack.price}
            </p>
          </div>

          <Separator />

          <p className="text-lg text-gray-600">{snack.contents}</p>

          {/* Interactive Hover Area */}
          <div className="group relative mt-4">
            <div className="group-hover:border-primary cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-all duration-300 group-hover:bg-white">
              <p className="group-hover:text-primary text-sm font-medium text-gray-500">
                마우스를 올려 상세 스펙을 확인하세요
              </p>
            </div>

            {/* Hidden Details revealed on hover */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="grid w-full grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    원산지
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {snack.details.origin}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    중량
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {snack.details.weight}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    칼로리
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {snack.details.calories}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    유통기한
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {snack.details.expiration}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Button
              size="lg"
              className="w-full text-lg font-bold">
              장바구니 담기
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Full Description */}
      <div className="mt-16 sm:mt-24">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">상품 설명</h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-lg leading-relaxed whitespace-pre-line text-gray-600">
            {snack.description}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Sub Image 1
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Sub Image 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
