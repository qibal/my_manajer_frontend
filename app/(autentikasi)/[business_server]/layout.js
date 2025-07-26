// app/[business_server]/layout.js
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { TooltipProvider } from "@/components/Shadcn/tooltip"
import BusinessServers from "@/components/organisms/Discord/BusinessServers"
import React from "react"
import { useBusinessData } from "@/hooks/use-business-data"

export default function BusinessLayout({ children }) {
  const router = useRouter()
  const params = useParams()
  const { business_server } = params
  console.log("BusinessLayout: Initial params", params);
  console.log("BusinessLayout: Initial business_server", business_server);

  const { businessList, channels, selectedBusiness, setSelectedBusiness, loading } = useBusinessData(business_server);

  useEffect(() => {
    if (selectedBusiness) {
      // channelService.getByBusinessId(selectedBusiness).then((res) => {
      //   console.log("BusinessLayout: channelService.getByBusinessId() response for selectedBusiness", selectedBusiness, res);
      //   if (res && res.data) {
      //     setChannels(res.data); // This will set to empty array if no data, or populated array
      //     console.log("BusinessLayout: Updated channels for selectedBusiness", selectedBusiness, res.data);
      //   } else {
      //     setChannels([]);
      //     console.log("BusinessLayout: No channels found for selectedBusiness", selectedBusiness);
      //   }
      // }).catch(error => {
      //   console.error("Error fetching channels for selectedBusiness", selectedBusiness, error);
      //   setChannels([]);
      // });
    } else {
        // setChannels([]); // Clear channels if no business is selected or if selectedBusiness becomes null
        console.log("BusinessLayout: No selected business, clearing channels.");
    }
  }, [selectedBusiness]);

  const handleSetSelectedBusiness = (businessId) => {
    setSelectedBusiness(businessId);
    const channelsForNewBusiness = (Array.isArray(channels) ? channels : []).filter(channel => channel.businessId === businessId);
    console.log("BusinessLayout: channelsForNewBusiness in handleSetSelectedBusiness", channelsForNewBusiness);
    if (channelsForNewBusiness.length > 0) {
        router.push(`/${businessId}/${channelsForNewBusiness[0].id}`);
    } else {
        router.push(`/${businessId}`);
    }
  }

  if (loading) {
    return (
      <TooltipProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <BusinessServers
            businessData={businessList || []}
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            onBusinessAdded={(newBusiness) => {
              // Asumsi newBusiness memiliki ID yang sudah valid
              setSelectedBusiness(newBusiness.id);
              // Kita tidak perlu memanipulasi businessList secara manual di sini,
              // karena useBusinessData akan mengambil ulang data secara otomatis (atau bisa ditambahkan logika optimis update jika diperlukan)
              // Untuk saat ini, kita akan redirect dan biarkan hook memuat ulang.
              router.push(`/${newBusiness.id}`);
            }}
            channels={channels || []}
          />
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading business data...
          </div>
        </div>
      </TooltipProvider>
    );
  }

  if (!selectedBusiness && businessList && businessList.length === 0) {
    router.push('/me');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <BusinessServers
          businessData={businessList}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
          onBusinessAdded={(newBusiness) => {
            // Asumsi newBusiness memiliki ID yang sudah valid
            setSelectedBusiness(newBusiness.id);
            router.push(`/${newBusiness.id}`);
          }}
          channels={channels}
        />
        {selectedBusiness ? (
          React.cloneElement(children, { selectedBusiness, businessList, channels })
        ) : null}
      </div>
    </TooltipProvider>
  )
}