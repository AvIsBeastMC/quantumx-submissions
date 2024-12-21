/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { api, getBaseUrl } from "~/utils/api";
import { Inter, Manrope, ShadowsIntoLight } from "./_app";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from "react";
import { NextPage, NextPageContext } from "next";

import slug from 'rehype-slug';
import { useRouter } from "next/router";

import '~/styles/index.module.css'

export const getServerSideProps = (async (context) => {
  const host = context.req.headers.host;
  const request = await fetch(`https://submit.thequantumx.xyz/md/submissions.md`)
  const text = await request.text();

  return {
    props: {
      markdown: text
    }
  }
}) satisfies GetServerSideProps<{ markdown: string }>

export default function Home({
  markdown,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      if (document) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // @ts-ignore
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      }
    }, 1200);
  }, [router])

  const takeTheTest = () => {
    void router.push('/submissions/new')
  }

  return (
    <>
      
      <main className="flex min-h-screen flex-col items-center justify-center main">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className={cn("text-5xl font-extrabold tracking-tight text-black sm:text-[4rem]", ShadowsIntoLight.className)}>
            AIS <span className="text-[hsl(280,100%,70%)]">QUANTUMX</span> SUBMISSIONS
          </h1>
          {/* <div className="prose lg:proxe-xl">
            <ReactMarkdown />
          </div> */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button
              onClick={() => setModalOpen(true)}
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-gray-100 p-4 text-black hover:bg-white/20 align-left"
            >
              <h3 className={cn("text-2xl font-bold", Manrope.className)}>Instructions →</h3>
              <div className="text-lg text-left">
                Just the basics - Everything you need to know before submitting your project.
              </div>
            </button>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-red-50 p-4 text-black hover:bg-white/20"
              href="/new"
            >
              <h3 className={cn("text-2xl font-bold text-red-600", Manrope.className)}>Submit Project →</h3>
              <p className="text-lg">
                {`Please feel free to contact the Student Supervisor close to you in case there's anything.`}
              </p>
            </Link>
          </div>
        </div>
      </main>

      <Modal scrollBehavior="inside" size="2xl" isOpen={isModalOpen} hideCloseButton onOpenChange={setModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className={cn("flex flex-col gap-1 font-bold", Inter.className)}>Instructions!</ModalHeader> */}
              <ModalBody className={cn(Inter.className, 'py-6')}>
                <div className="prose prose-sm !max-w-none ">
                  <ReactMarkdown rehypePlugins={[slug]}>{markdown}</ReactMarkdown>
                </div>
              </ModalBody>
              <ModalFooter className={cn(Inter.className)}>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}