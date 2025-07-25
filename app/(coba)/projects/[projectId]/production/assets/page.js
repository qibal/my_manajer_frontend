"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import { Badge } from '@/components/Shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Shadcn/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Shadcn/select';
import { Skeleton } from '@/components/Shadcn/skeleton';
import { 
  Search, 
  Grid3X3, 
  List, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  MoreVertical,
  Filter,
  Plus,
  Settings,
  Music,
  Image,
  Video,
  Volume1,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Import JSON data directly
import assetData from '@/data_dummy/projects/asset.json';

export default function ProjectAssetManagementPage() {
  const params = useParams();
  const projectId = params.projectId;

  const [assets, setAssets] = useState(null);
  const [projectAssetIds, setProjectAssetIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [activeTab, setActiveTab] = useState('sound_effects');
  const [filterCategory, setFilterCategory] = useState('all');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  // Load all assets and initialize project-specific assets
  useEffect(() => {
    try {
      setAssets(assetData);
      
      if (projectId) {
        const initialIds = new Set();
        Object.values(assetData).flat().forEach(asset => {
          if (String(asset.projectId) === projectId) {
            initialIds.add(asset.id);
          }
        });
        setProjectAssetIds(initialIds);
      }
      toast.success('Data aset proyek berhasil dimuat!');
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Gagal memuat data aset proyek');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Toggle asset selection for the project
  const toggleAssetSelection = (assetId) => {
    const newProjectAssetIds = new Set(projectAssetIds);
    if (newProjectAssetIds.has(assetId)) {
      newProjectAssetIds.delete(assetId);
      toast.info('Aset dilepaskan dari proyek.');
    } else {
      newProjectAssetIds.add(assetId);
      toast.success('Aset ditambahkan ke proyek!');
    }
    setProjectAssetIds(newProjectAssetIds);
  };

  // Filter assets based on search and category
  const getFilteredAssets = (assetType) => {
    if (!assets) return [];
    
    let filtered = assets[assetType] || [];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === filterCategory);
    }
    
    return filtered;
  };

  // Get unique categories for filter
  const getCategories = (assetType) => {
    if (!assets || !assets[assetType]) return [];
    const categories = [...new Set(assets[assetType].map(asset => asset.category))];
    return categories;
  };

  // Audio playback functions
  const playAudio = (assetId, audioUrl) => {
    if (playingAudio === assetId) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingAudio(null);
      setAudioElement(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(audioUrl || '/assets/audio/placeholder.mp3');
      audio.play();
      setPlayingAudio(assetId);
      setAudioElement(audio);
      
      audio.onended = () => {
        setPlayingAudio(null);
        setAudioElement(null);
      };
    }
  };

  // Skeletons
  const SoundEffectSkeleton = () => (
    <Card className="w-full"><CardContent className="p-4"><div className="flex items-center space-x-3"><Skeleton className="h-12 w-12 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div><Skeleton className="h-8 w-8 rounded" /></div></CardContent></Card>
  );
  const MusicSkeleton = () => (
    <Card className="w-full"><CardContent className="p-6"><div className="space-y-4"><div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div><Skeleton className="h-10 w-10 rounded-full" /></div><Skeleton className="h-3 w-full" /><div className="flex space-x-1">{Array.from({ length: 20 }).map((_, i) => (<Skeleton key={i} className="h-8 w-1 rounded" />))}</div></div></CardContent></Card>
  );
  const MediaSkeleton = () => (
    <Card className="w-full"><CardContent className="p-4"><Skeleton className="h-32 w-full rounded-lg mb-3" /><div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></CardContent></Card>
  );

  // Asset components with selection logic
  const SoundEffectCard = ({ asset }) => {
    const isSelected = projectAssetIds.has(asset.id);
    return (
      <Card className={`w-full hover:shadow-md transition-all ${isSelected ? 'border-2 border-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0"><div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"><Volume2 className="h-6 w-6 text-blue-600" /></div></div>
            <div className="flex-1 min-w-0"><h3 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h3><p className="text-xs text-gray-500">{asset.duration} • {asset.format}</p></div>
            <Button size="sm" variant="ghost" onClick={() => playAudio(asset.id)} className="flex-shrink-0">{playingAudio === asset.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">{asset.tags.slice(0, 3).map((tag, index) => (<Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>))}</div>
          <Button onClick={() => toggleAssetSelection(asset.id)} variant={isSelected ? "secondary" : "default"} size="sm" className="w-full mt-3 flex items-center gap-2">
            {isSelected ? <><XCircle className="h-4 w-4" /> Lepaskan dari Proyek</> : <><CheckCircle className="h-4 w-4" /> Pilih untuk Proyek</>}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const MusicCard = ({ asset }) => {
    const isSelected = projectAssetIds.has(asset.id);
    return (
      <Card className={`w-full hover:shadow-md transition-all ${isSelected ? 'border-2 border-blue-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3><p className="text-sm text-gray-600">{asset.artist}</p></div>
            <Button size="sm" variant="ghost" onClick={() => playAudio(asset.id)} className="flex-shrink-0">{playingAudio === asset.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</Button>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{asset.description}</p>
          <div className="flex items-end space-x-1 h-12 mb-4">{asset.waveform_data.map((height, index) => (<div key={index} className="bg-blue-500 rounded-sm flex-1" style={{ height: `${height * 100}%` }} />))}</div>
          <div className="flex items-center justify-between text-xs text-gray-500"><span>{asset.duration}</span><span>{asset.genre} • {asset.mood}</span></div>
          <div className="mt-3 flex flex-wrap gap-1">{asset.tags.slice(0, 4).map((tag, index) => (<Badge key={index} variant="outline" className="text-xs">{tag}</Badge>))}</div>
          <Button onClick={() => toggleAssetSelection(asset.id)} variant={isSelected ? "secondary" : "default"} size="sm" className="w-full mt-4 flex items-center gap-2">
            {isSelected ? <><XCircle className="h-4 w-4" /> Lepaskan dari Proyek</> : <><CheckCircle className="h-4 w-4" /> Pilih untuk Proyek</>}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  const PhotoCard = ({ asset }) => {
    const isSelected = projectAssetIds.has(asset.id);
    return (
      <Card className={`w-full hover:shadow-md transition-all ${isSelected ? 'border-2 border-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center"><Image className="h-8 w-8 text-gray-400" /></div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">{asset.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{asset.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500"><span>{asset.dimensions}</span><span>{asset.format}</span></div>
          <div className="mt-2 flex flex-wrap gap-1">{asset.tags.slice(0, 3).map((tag, index) => (<Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>))}</div>
          <Button onClick={() => toggleAssetSelection(asset.id)} variant={isSelected ? "secondary" : "default"} size="sm" className="w-full mt-3 flex items-center gap-2">
            {isSelected ? <><XCircle className="h-4 w-4" /> Lepaskan dari Proyek</> : <><CheckCircle className="h-4 w-4" /> Pilih untuk Proyek</>}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const VideoCard = ({ asset }) => {
    const isSelected = projectAssetIds.has(asset.id);
    return (
      <Card className={`w-full hover:shadow-md transition-all ${isSelected ? 'border-2 border-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative"><Video className="h-8 w-8 text-gray-400" /><div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">{asset.duration}</div></div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">{asset.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{asset.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500"><span>{asset.dimensions}</span><span>{asset.format}</span></div>
          <div className="mt-2 flex flex-wrap gap-1">{asset.tags.slice(0, 3).map((tag, index) => (<Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>))}</div>
          <Button onClick={() => toggleAssetSelection(asset.id)} variant={isSelected ? "secondary" : "default"} size="sm" className="w-full mt-3 flex items-center gap-2">
            {isSelected ? <><XCircle className="h-4 w-4" /> Lepaskan dari Proyek</> : <><CheckCircle className="h-4 w-4" /> Pilih untuk Proyek</>}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Asset Library: {projectId}</h1>
          <p className="text-gray-600 mt-1">Pilih aset dari pustaka global untuk digunakan dalam proyek ini.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => toast.info('Fitur kelola sedang dalam pengembangan.')}>
            <Settings className="h-4 w-4 mr-2" />
            Kelola Aset Proyek
          </Button>
          <Button size="sm" onClick={() => toast.success('Aset baru akan ditambahkan ke pustaka global.')}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Aset Baru
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Cari di pustaka global berdasarkan nama, deskripsi, atau tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getCategories(activeTab).map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600">
            <Badge variant="default">{projectAssetIds.size} aset dipilih</Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === 'card' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('card')}><Grid3X3 className="h-4 w-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sound_effects" className="flex items-center space-x-2"><Volume1 className="h-4 w-4" /><span>Sound Effects</span></TabsTrigger>
          <TabsTrigger value="music" className="flex items-center space-x-2"><Music className="h-4 w-4" /><span>Music</span></TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center space-x-2"><Image className="h-4 w-4" /><span>Photos</span></TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center space-x-2"><Video className="h-4 w-4" /><span>Videos</span></TabsTrigger>
        </TabsList>

        {/* Content for each tab */}
        <TabsContent value="sound_effects" className="mt-6">
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{Array.from({ length: 8 }).map((_, i) => <SoundEffectSkeleton key={i} />)}</div>
          ) : (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{getFilteredAssets('sound_effects').map((asset) => (<SoundEffectCard key={asset.id} asset={asset} />))}</div>
          )}
        </TabsContent>

        <TabsContent value="music" className="mt-6">
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>{Array.from({ length: 6 }).map((_, i) => <MusicSkeleton key={i} />)}</div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>{getFilteredAssets('music').map((asset) => (<MusicCard key={asset.id} asset={asset} />))}</div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{Array.from({ length: 8 }).map((_, i) => <MediaSkeleton key={i} />)}</div>
          ) : (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{getFilteredAssets('photos').map((asset) => (<PhotoCard key={asset.id} asset={asset} />))}</div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{Array.from({ length: 8 }).map((_, i) => <MediaSkeleton key={i} />)}</div>
          ) : (
            <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>{getFilteredAssets('videos').map((asset) => (<VideoCard key={asset.id} asset={asset} />))}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 