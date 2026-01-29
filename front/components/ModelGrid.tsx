import React from "react";
import Link from "next/link";
import { ModelCard } from "./ModelCard";
import { Model } from "../types/types";

interface ModelGridProps {
    models: Model[];
    filteredModels: Model[];
}

export const ModelGrid: React.FC<ModelGridProps> = ({
                                                        models,
                                                        filteredModels,
                                                    }) => {
    const displayModels = filteredModels.length ? filteredModels : models;

    return (
        <div className="model-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,200px)',gap:'32px',justifyContent:'start'}}>
            {displayModels?.map((model) => (
                <Link href={`/models/${model.id}`} key={model.id} legacyBehavior>
                    <a style={{textDecoration:'none', color:'inherit'}}>
                        <div className="model-card" style={{width:200,height:225,minWidth:200,maxWidth:200,display:'flex',flexDirection:'column',alignItems:'center',borderRadius:18,background:'#e1e1e1',boxShadow:'0 2px 12px rgba(44,40,37,0.06)'}}>
                            <div className="model-card-preview" style={{background:'#d3d3d3',width:180,height:180,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:13,marginTop:14}}>
                                {model.imageUrl ? (
                                    <img src={model.imageUrl} alt={model.name} style={{width: '90%', height: '90%', objectFit: 'contain', borderRadius: 10}} />
                                ) : null}
                            </div>
                            <div className="model-card-title" style={{marginTop:11,fontSize:'1.18rem',fontWeight:500,color:'#181818',textAlign:'center',paddingBottom:0}}>{model.name}</div>
                        </div>
                    </a>
                </Link>
            ))}
        </div>
    );
};

