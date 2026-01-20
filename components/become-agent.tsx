"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SecureAgentRegistrationModal } from "./SecureAgentRegistrationModal"

export default function BecomeAgent() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="become-moving-agent" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Become a Moving Agent</h2>
            <p className="text-gray-600 mb-8">
              Own a truck or van? Join Déligo and earn by helping others move. Set your own schedule and be your own
              boss.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white hover:bg-primary/90">
              Register as an Agent
            </Button>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <Image
              src="/become-agent-image.png"
              alt="Professional Déligo delivery agent standing next to branded delivery van"
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <SecureAgentRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
