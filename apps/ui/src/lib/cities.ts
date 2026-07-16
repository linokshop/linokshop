/**
 * Cities and branches offered by the checkout autocomplete.
 *
 * A stand-in for the Nova Poshta directory: the real integration needs an API
 * key and a decision we have not made yet, so the shape here matches what the
 * API would return (city → branches) to keep the swap to a single fetch.
 * The order still travels to Telegram as free text, so a customer typing a city
 * we do not list loses nothing.
 */
export interface City {
  readonly name: string
  readonly region: string
}

export const CITIES: readonly City[] = [
  { name: "Київ", region: "Київська обл." },
  { name: "Житомир", region: "Житомирська обл." },
  { name: "Львів", region: "Львівська обл." },
  { name: "Одеса", region: "Одеська обл." },
  { name: "Дніпро", region: "Дніпропетровська обл." },
  { name: "Харків", region: "Харківська обл." },
  { name: "Вінниця", region: "Вінницька обл." },
  { name: "Полтава", region: "Полтавська обл." },
  { name: "Запоріжжя", region: "Запорізька обл." },
  { name: "Черкаси", region: "Черкаська обл." },
  { name: "Чернігів", region: "Чернігівська обл." },
  { name: "Рівне", region: "Рівненська обл." },
]

export const branchesFor = (city: string): readonly string[] => [
  `Відділення №1: вул. Київська, 12 (${city})`,
  `Відділення №5: вул. Перемоги, 44 (${city})`,
  `Поштомат №24737: ТЦ «Глобал» (${city})`,
  `Відділення №17: вул. Соборна, 3 (${city})`,
]

/** Cities are matched by prefix, the way a directory lookup behaves. */
export const matchCities = (query: string): readonly City[] => {
  const q = query.trim().toLowerCase()
  if (!q) {
    return []
  }

  return CITIES.filter((city) => city.name.toLowerCase().startsWith(q))
}
