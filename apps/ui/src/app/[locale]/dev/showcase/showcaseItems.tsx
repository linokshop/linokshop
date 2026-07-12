import AccordionSection from "@/app/[locale]/dev/showcase/components/sections/AccordionSection"
import BodyVariantsSection from "@/app/[locale]/dev/showcase/components/sections/BodyVariantsSection"
import ButtonsSection from "@/app/[locale]/dev/showcase/components/sections/ButtonsSection"
import CardSection from "@/app/[locale]/dev/showcase/components/sections/CardSection"
import CheckboxSection from "@/app/[locale]/dev/showcase/components/sections/CheckboxSection"
import ColorsSection from "@/app/[locale]/dev/showcase/components/sections/ColorsSection"
import DialogSection from "@/app/[locale]/dev/showcase/components/sections/DialogSection"
import FontFamiliesSection from "@/app/[locale]/dev/showcase/components/sections/FontFamiliesSection"
import HeadingsVariantsSection from "@/app/[locale]/dev/showcase/components/sections/HeadingsVariantsSection"
import InputSection from "@/app/[locale]/dev/showcase/components/sections/InputSection"
import RadioGroupSection from "@/app/[locale]/dev/showcase/components/sections/RadioGroupSection"
import SelectSection from "@/app/[locale]/dev/showcase/components/sections/SelectSection"
import TableSection from "@/app/[locale]/dev/showcase/components/sections/TableSection"
import TabsSection from "@/app/[locale]/dev/showcase/components/sections/TabsSection"
import TextareaSection from "@/app/[locale]/dev/showcase/components/sections/TextareaSection"
import TooltipSection from "@/app/[locale]/dev/showcase/components/sections/TooltipSection"

export const showcaseItems = [
  // Atomic items
  {
    id: "colors",
    label: "Colors",
    kind: "atomic",
    component: ColorsSection,
    description: "Theme color palette showcase",
  },
  {
    id: "font-families",
    label: "Font Families",
    kind: "atomic",
    component: FontFamiliesSection,
    description: "Different font families used across the site",
  },
  {
    id: "headings",
    label: "Headings Variants",
    kind: "atomic",
    component: HeadingsVariantsSection,
    description: "Different heading styles and weights",
  },
  {
    id: "body-variants",
    label: "Body Variants",
    kind: "atomic",
    component: BodyVariantsSection,
    description: "Body text variants used across the site",
  },
  {
    id: "buttons",
    label: "Buttons",
    kind: "atomic",
    component: ButtonsSection,
    description: "Button variants, sizes and states",
  },
  {
    id: "input",
    label: "Input",
    kind: "atomic",
    component: InputSection,
    description: "Input field showcase",
  },
  {
    id: "textarea",
    label: "Textarea",
    kind: "atomic",
    component: TextareaSection,
    description: "Textarea field showcase",
  },
  {
    id: "select",
    label: "Select",
    kind: "atomic",
    component: SelectSection,
    description: "Select dropdown showcase",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    kind: "atomic",
    component: CheckboxSection,
    description: "Checkbox states showcase",
  },
  {
    id: "radio-group",
    label: "Radio Group",
    kind: "atomic",
    component: RadioGroupSection,
    description: "Radio group showcase",
  },
  {
    id: "table",
    label: "Table",
    kind: "atomic",
    component: TableSection,
    description: "Table and data display showcase",
  },
  {
    id: "dialog",
    label: "Dialog",
    kind: "atomic",
    component: DialogSection,
    description: "Dialog/modal showcase",
  },
  {
    id: "tooltip",
    label: "Tooltip",
    kind: "atomic",
    component: TooltipSection,
    description: "Tooltip usage showcase",
  },
  {
    id: "accordion",
    label: "Accordion",
    kind: "atomic",
    component: AccordionSection,
    description: "Accordion showcase",
  },
  {
    id: "tabs",
    label: "Tabs",
    kind: "atomic",
    component: TabsSection,
    description: "Tabs showcase",
  },
  {
    id: "card",
    label: "Card",
    kind: "atomic",
    component: CardSection,
    description: "Card component showcase",
  },
] as const

export default showcaseItems
