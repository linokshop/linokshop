"use client"

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

type HeaderMobileContextValue = [boolean, Dispatch<SetStateAction<boolean>>]

const HeaderMobileContext = createContext<HeaderMobileContextValue | null>(null)

export function HeaderMobileProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <HeaderMobileContext.Provider
      // React Compiler handles this memoization; keeping this explicit avoids
      // unnecessary useMemo noise around a tiny UI state provider.
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={[mobileOpen, setMobileOpen]}
    >
      {children}
    </HeaderMobileContext.Provider>
  )
}

export function useHeaderMobile() {
  const context = useContext(HeaderMobileContext)

  if (context == null) {
    throw new Error("Header mobile controls must be used inside provider")
  }

  return context
}
