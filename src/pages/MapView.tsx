import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { MapView as MapComponent } from '../components/Map/MapView';
import { PlotDetailsModal } from '../components/Plots/PlotDetailsModal';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/Plots/SearchFilters';
import { Plot } from '../types';
import { apiService } from '../services/api';

export const MapView: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async (filters?: SearchFiltersType) => {
    try {
      setLoading(true);
      
      const searchParams: any = { status: 'available' };
      
      if (filters) {
        if (filters.search) searchParams.search = filters.search;
        if (filters.minPrice > 0) searchParams.min_price = filters.minPrice;
        if (filters.maxPrice < 10000000) searchParams.max_price = filters.maxPrice;
        if (filters.minArea > 0) searchParams.min_area = filters.minArea;
        if (filters.maxArea < 10000) searchParams.max_area = filters.maxArea;
        if (filters.councilId) searchParams.council_id = filters.councilId;
        if (filters.districtId) searchParams.district_id = filters.districtId;
        if (filters.regionId) searchParams.region_id = filters.regionId;
        if (filters.usageType) searchParams.usage_type = filters.usageType;
      }

      const data = await apiService.getPlots(searchParams);
      setPlots(data);
    } catch (error) {
      console.error('Error fetching plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFiltersType) => {
    fetchPlots(filters);
  };

  const handlePlotClick = (plot: Plot) => {
    setSelectedPlot(plot);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Map View
          </h1>
          <p className="text-gray-600">
            Explore available plots on the interactive map
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Map Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <span className="text-gray-700">Found {plots.length} plots</span>
              </div>
              
              <div className="h-[600px]">
                <MapComponent
                  plots={plots}
                  onPlotClick={handlePlotClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plot Details Modal */}
        {selectedPlot && (
          <PlotDetailsModal
            plot={selectedPlot}
            isOpen={!!selectedPlot}
            onClose={() => setSelectedPlot(null)}
          />
        )}
      </div>
    </Layout>
  );
};