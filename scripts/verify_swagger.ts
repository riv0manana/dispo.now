
async function main() {
  const res = await fetch('http://localhost:8000/doc')
  if (res.ok) {
    console.log('✅ Swagger JSON retrieved successfully')
    const json = await res.json()
    console.log('Title:', json.info.title)
    console.log('Paths:', Object.keys(json.paths))
  } else {
    console.error('❌ Failed to get Swagger JSON', res.status)
  }
}
main()
