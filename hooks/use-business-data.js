"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import businessService from "@/service/business_service"
import channelService from "@/service/channel_service"
import { useAuth } from '@/hooks/use-auth'

export function useBusinessData(initialBusinessId = null) {
    const router = useRouter()
    const { user, isSuperAdmin, loading: authLoading } = useAuth(); // Menambahkan isSuperAdmin

    const [businessList, setBusinessList] = useState(null)
    const [channels, setChannels] = useState(null)
    const [selectedBusiness, setSelectedBusiness] = useState(initialBusinessId)
    const [loading, setLoading] = useState(true)

    // Load businesses
    useEffect(() => {
        if (authLoading) return; // Tunggu data user dimuat

        const fetchBusinesses = async () => {
            try {
                const res = await businessService.getAll()
                if (res && res.data) {
                    setBusinessList(res.data)
                    let currentBusinessId = initialBusinessId

                    if (res.data.length > 0) {
                        if (initialBusinessId && res.data.some(b => b.id === initialBusinessId)) {
                            currentBusinessId = initialBusinessId
                        } else {
                            currentBusinessId = res.data[0].id
                            // Hanya redirect jika kita berada di /me dan ada bisnis yang bisa dipilih
                            if (window.location.pathname === '/me') {
                                router.replace(`/${res.data[0].id}`)
                            }
                        }
                        setSelectedBusiness(currentBusinessId)
                    } else {
                        setSelectedBusiness(null)
                    }
                } else {
                    setBusinessList([])
                    setSelectedBusiness(null)
                    console.error("Business service returned invalid data or no data.")
                    // Jika tidak ada bisnis, arahkan ke /me, kecuali jika user adalah super_admin
                    if (!isSuperAdmin && window.location.pathname !== '/me') {
                        router.push('/me')
                    }
                }
            } catch (error) {
                console.error("Error fetching businesses:", error)
                setBusinessList([])
                setSelectedBusiness(null)
                // Jika error, arahkan ke /me, kecuali jika user adalah super_admin
                if (!isSuperAdmin && window.location.pathname !== '/me') {
                    router.push('/me')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBusinesses()
    }, [initialBusinessId, router, user, authLoading, isSuperAdmin]) // Menambahkan isSuperAdmin

    // Load channels based on selectedBusiness
    useEffect(() => {
        if (!selectedBusiness) {
            setChannels([])
            return
        }

        const fetchChannels = async () => {
            try {
                const res = await channelService.getByBusinessId(selectedBusiness)
                if (res && res.data) {
                    setChannels(res.data)
                } else {
                    setChannels([])
                    console.log("No channels found for selectedBusiness", selectedBusiness)
                }
            } catch (error) {
                console.error("Error fetching channels for selectedBusiness", selectedBusiness, error)
                setChannels([])
            }
        }
        fetchChannels()
    }, [selectedBusiness])

    const handleSetSelectedBusiness = (businessId) => {
        setSelectedBusiness(businessId)
        // Router push ke bisnis baru, atau ke channel pertama jika ada
        const channelsForNewBusiness = (Array.isArray(channels) ? channels : []).filter(channel => channel.businessId === businessId)
        if (channelsForNewBusiness.length > 0) {
            router.push(`/${businessId}/${channelsForNewBusiness[0].id}`)
        } else {
            router.push(`/${businessId}`)
        }
    }

    return {
        businessList,
        channels,
        selectedBusiness,
        setSelectedBusiness: handleSetSelectedBusiness,
        loading,
    }
} 