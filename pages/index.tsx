import type { GetStaticProps, NextPage } from 'next'
import React, { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/db.module.css'
import type { UrlObject } from 'node:url'

import {
  FetchBlocks,
  FetchPage,
  ListBlockChildrenResponseEx,
  RichTextItemResponse,
  TitlePropertyItemObjectResponse,
} from '../src/server'

import {
  Blocks,
  TextObject,
} from '../src/components'

type Props = {
  title: null|RichTextItemResponse
  icon: string
  image: string
  blocks: ListBlockChildrenResponseEx
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const id = process.env.NOTION_TESTROOT_ID as string
  const page = await FetchPage(id)
  let title: null|RichTextItemResponse = null
  if ('meta' in page && page.meta?.object === 'list') {
    const obj = page.meta.results.find(v => v.type === 'title') as TitlePropertyItemObjectResponse
    title = obj.title
  }
  const icon = ('emoji' in page.icon) ? page.icon.emoji : ''
  const image = page.cover.src
  const blocks = await FetchBlocks(id)

  return {
    props: {
      title,
      icon,
      image,
      blocks,
    }
  }
}

const Home: NextPage<Props> = ({ title, icon, image, blocks }) => {
  const position = {
    objectPosition: 'center 30%',
  }
  return (
    <>
      <Head>
        <title>Notionate</title>
        <link rel="icon" href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${icon}</text></svg>`} />
      </Head>

      <header className={styles.headerPage}>
        <img className={styles.cover} src={image} style={position} />
        <div className={`${styles.headerInnerPage} ${styles.wrapperPage}`}>
          <div className={styles.icon}>
            {icon}
          </div>
          <h1 className={styles.title}>
            {title && <TextObject textObject={title} />}
          </h1>
        </div>
      </header>

      <div className={`${styles.page} ${styles.wrapperPage}`}>
        <Blocks
          blocks={blocks}
          href="/[title]"
          link={Link as React.FC<{ children: ReactElement<'a'>, href: string | UrlObject}>}
        />
      </div>
    </>
  )
}

export default Home
