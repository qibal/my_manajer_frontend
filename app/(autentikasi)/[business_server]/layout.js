// app/[business_server]/layout.js
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { TooltipProvider } from "@/components/Shadcn/tooltip"
import BusinessServers from "@/components/organisms/Discord/BusinessServers"
import businessService from "@/service/business_service"
import channelService from "@/service/channel_service"
import React from "react"

export default function BusinessLayout({ children }) {
  const router = useRouter()
  const params = useParams()
  const { business_server } = params
  console.log("BusinessLayout: Initial params", params);
  console.log("BusinessLayout: Initial business_server", business_server);

  const [businessList, setBusinessList] = useState(null); // Initialize as null
  const [channels, setChannels] = useState(null); // Initialize as null
  const [selectedBusiness, setSelectedBusiness] = useState(business_server || null);

  useEffect(() => {
    businessService.getAll().then((res) => {
      console.log("BusinessLayout: businessService.getAll() response", res);
      if (res && res.data) {
        setBusinessList(res.data); // This will set to empty array if no data, or populated array
        console.log("BusinessLayout: Updated businessList", res.data);

        if (res.data.length > 0) {
          let initialBusinessToSelect = null;
          if (business_server && res.data.some(b => b.id === business_server)) {
            initialBusinessToSelect = business_server;
          } else {
            initialBusinessToSelect = res.data[0].id;
            router.replace(`/${res.data[0].id}`);
          }
          setSelectedBusiness(initialBusinessToSelect);
          console.log("BusinessLayout: Updated selectedBusiness", initialBusinessToSelect);
        } else {
          setSelectedBusiness(null); // No business to select if list is empty
          console.log("BusinessLayout: No businesses found, selectedBusiness set to null.");
        }
      } else {
        setBusinessList([]); // Ensure it's an empty array even on invalid response
        setSelectedBusiness(null);
        console.error("Business service returned invalid data or no data.");
        // Redirect ke /@me jika tidak ada bisnis
        router.push('/@me');
      }
    }).catch(error => {
      console.error("Error fetching businesses:", error);
      setBusinessList([]); // Ensure it's an empty array on error
      setSelectedBusiness(null);
      // Redirect ke /@me jika terjadi error
      router.push('/@me');
    });
  }, [business_server, router]);

  useEffect(() => {
    if (selectedBusiness) {
      channelService.getByBusinessId(selectedBusiness).then((res) => {
        console.log("BusinessLayout: channelService.getByBusinessId() response for selectedBusiness", selectedBusiness, res);
        if (res && res.data) {
          setChannels(res.data); // This will set to empty array if no data, or populated array
          console.log("BusinessLayout: Updated channels for selectedBusiness", selectedBusiness, res.data);
        } else {
          setChannels([]);
          console.log("BusinessLayout: No channels found for selectedBusiness", selectedBusiness);
        }
      }).catch(error => {
        console.error("Error fetching channels for selectedBusiness", selectedBusiness, error);
        setChannels([]);
      });
    } else {
        setChannels([]); // Clear channels if no business is selected or if selectedBusiness becomes null
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

  if (businessList === null || channels === null) {
    return (
      <TooltipProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <BusinessServers
            businessData={businessList || []}
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={handleSetSelectedBusiness}
            onBusinessAdded={(newBusiness) => {
              setBusinessList((prevList) => [...prevList, newBusiness]);
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

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <BusinessServers
          businessData={businessList}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={handleSetSelectedBusiness}
          onBusinessAdded={(newBusiness) => {
            setBusinessList((prevList) => [...prevList, newBusiness]);
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