type ListProps<T> = {
  data: T[]
  getKey: (item: T) => React.Key
  renderItem: (item: T) => React.ReactNode
}

export default function List<T>({ data, getKey, renderItem }: ListProps<T>) {
  return (
    <ul className="space-y-3">
      {data.map(item => (
        <li
          key={getKey(item)}
          className="rounded-md border p-4">
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

{
  /* <List
  data={products}
  getKey={product => product.id}
  renderItem={product => (
    <>
      <div className="font-medium">{product.name}</div>
      <div className="text-muted-foreground text-sm">
        {product.price.toLocaleString('ko-KR')}원
      </div>
    </>
  )}
/>

<List
  data={users}
  getKey={user => user.id}
  renderItem={user => (
    <>
      <div className="font-medium">{user.name}</div>
      <div className="text-muted-foreground text-sm">{user.email}</div>
    </>
  )}
/> */
}
