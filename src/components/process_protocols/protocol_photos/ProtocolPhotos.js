import React, { useState, Suspense, useRef } from 'react'

import useKeypress from 'react-use-keypress'

import PageGallery from './PageGallery'
import PhotoSection from './PhotoSection'

export default (props) => {
  const [page, setPage] = useState(null)

  const maxPage = props.protocol.pictures.length - 1
  const nextAvail = page < maxPage
  const prevAvail = page > 0

  useKeypress(['ArrowLeft'], (event) => {
    event.preventDefault()
    prevPage()
  })
  useKeypress(['ArrowRight'], (event) => {
    event.preventDefault()
    nextPage()
  })

  const prevPage = () => {
    if (prevAvail) setPage(page - 1)
  }

  const nextPage = () => {
    if (nextAvail) setPage(page + 1)
  }

  return page === null ? (
    <PageGallery
      setPage={setPage}
      protocol={props.protocol}
      reorderPictures={props.reorderPictures}
    />
  ) : (
    <PhotoSection
      page={page}
      setPage={setPage}
      protocol={props.protocol}
      reorderPictures={props.reorderPictures}
      prevAvail={prevAvail}
      nextAvail={nextAvail}
      nextPage={nextPage}
      prevPage={prevPage}
    />
  )
}
