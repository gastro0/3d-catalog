import React from "react";
import { Model } from "../types/types";

interface ModelCardProps {
    model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
    return (
        <article className="overflow-hidden rounded-2xl transition-transform cursor-pointer bg-white duration-[0.3s] ease-[cubic-bezier(0.2,0,0.5,1)] hover:transform hover:scale-[1.02]">
            <div className="overflow-hidden relative pt-72">
                <img
                    className="object-cover overflow-hidden absolute top-0 left-0 transition-transform aspect-square duration-[0.3s] ease-[ease] size-full hover:scale-110"
                    src={
                        model.imageUrl ||
                        "https://via.placeholder.com/400x400?text=3D+Model"
                    }
                    alt={`3D model of ${model.name}`}
                />
            </div>
            <div className="p-5">
                <h3 className="mx-0 mt-0 mb-2.5 text-lg font-medium">{model.name}</h3>
                <div className="flex justify-between items-center text-sm text-stone-400">
                    <span>{model.format}</span>
                    <span>
                        <span>{model.polygons}</span>
                        <span>k polygons</span>
                    </span>
                </div>
            </div>
        </article>
    );
};
