import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Circuit } from "@/types/circuit";
import { useCircuitManagement } from "@/hooks/useCircuitManagement";
import CircuitDetailsCard from "@/components/circuit-details/CircuitDetailsCard";
import AddEditCircuitDialog from "@/components/circuits/AddEditCircuitDialog";
import { toast } from "sonner";
import { fetchCircuitById } from "@/services/circuitService";

const CircuitDetails = () => {
  const { circuitId } = useParams();
  const { circuits, handleEditCircuit } = useCircuitManagement();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCircuit = async () => {
      if (!circuitId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchCircuitById(circuitId);
        
        if (data) {
          setCircuit(data as Circuit);
        } else {
          // Fallback to local state if not found in Supabase
          const foundCircuit = circuits.find(circuit => circuit.id === circuitId);
          setCircuit(foundCircuit || null);
        }
      } catch (error) {
        console.error("Error fetching circuit:", error);
        toast.error("Failed to load circuit details");
        
        // Fallback to local state on error
        const foundCircuit = circuits.find(circuit => circuit.id === circuitId);
        setCircuit(foundCircuit || null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCircuit();
  }, [circuitId, circuits]);

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-40 bg-white/10 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!circuit) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12 text-white/60">
            Circuit not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Circuit Details</h1>
        
        <CircuitDetailsCard 
          circuit={circuit} 
          onEdit={handleOpenEditDialog}
        />

        {/* Circuit details content - can be expanded later */}
      </div>

      <AddEditCircuitDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveCircuit}
        circuitToEdit={circuit}
        isEditing={true}
      />
    </Layout>
  );

  function handleOpenEditDialog(circuitId: string) {
    setIsEditDialogOpen(true);
  }

  function handleSaveCircuit(updatedCircuitData: Omit<Circuit, 'id' | 'created_at' | 'updated_at'>) {
    if (!circuit) return;
    
    const updatedCircuit: Circuit = {
      ...circuit,
      ...updatedCircuitData,
      updated_at: new Date().toISOString()
    };
    
    const result = handleEditCircuit(updatedCircuit);
    if (result) {
      setCircuit(updatedCircuit);
    }
    setIsEditDialogOpen(false);
  }
};

export default CircuitDetails;
