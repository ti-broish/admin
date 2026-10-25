// Since ti-broish v0.0.85 the web /signal form starts the description with
// "Адрес: <address>, район <district>", "Адрес: <address>" or "Район: <district>",
// then a blank line. The address is the section place from the API.
const DISTRICT_SEPARATOR = ', район '

export const parsePlaceLine = (description) => {
  if (!description) return null
  const first = description.split(/\r?\n/, 1)[0].trim()
  const address = first.match(/^Адрес:\s*(.+)$/)
  if (address) {
    const rest = address[1].trim()
    const at = rest.lastIndexOf(DISTRICT_SEPARATOR)
    if (at > 0) {
      return {
        address: rest.slice(0, at).trim(),
        district: rest.slice(at + DISTRICT_SEPARATOR.length).trim() || null,
      }
    }
    return { address: rest, district: null }
  }
  const district = first.match(/^Район:\s*(.+)$/)
  if (district) return { address: null, district: district[1].trim() }
  return null
}

const normalize = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/^(р-н|район)\s+/, '')
    .replace(/[\s"„“”'.,]+/g, ' ')
    .trim()

export const findCityRegion = (town, district) => {
  if (!district) return null
  const wanted = normalize(district)
  return (
    (town?.cityRegions || []).find(
      (region) => normalize(region.name) === wanted
    ) || null
  )
}

export const sectionsAtAddress = (sections, address) => {
  const wanted = normalize(address)
  if (!wanted) return []
  return sections.filter((section) => normalize(section.place) === wanted)
}

// Section ids start with the two-digit election region (МИР) code.
export const commonElectionRegionCode = (sections) => {
  const codes = [...new Set(sections.map((section) => section.id.slice(0, 2)))]
  return codes.length === 1 ? codes[0] : null
}

// "2346" (МИР 23, община 46) or "234602" with a known city region.
export const expectedSectionPrefixes = (data, lookup) => {
  const municipalityCode = data.town?.municipality?.code
  if (data.section) {
    return [data.section.id.slice(0, municipalityCode ? 4 : 2)]
  }
  if (!municipalityCode) return []
  if (lookup?.electionRegionCode) {
    return [
      lookup.electionRegionCode +
        municipalityCode +
        (lookup.cityRegion?.code || ''),
    ]
  }
  return (data.town.municipality.electionRegions || [])
    .map((region) => region.code)
    .filter(Boolean)
    .sort()
    .map((code) => code + municipalityCode)
}
