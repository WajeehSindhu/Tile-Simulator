import React, { useState } from "react";
import { useTileSimulator } from "../context/TileSimulatorContext";

const ColorEditor = ({ tile }) => {
  const { setTileMaskColor, tileMasks, selectedBorder, setSelectedBorder } = useTileSimulator();
  const [hoveredPaletteColor, setHoveredPaletteColor] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Track which mask is selected for editing
  const [selectedMaskId, setSelectedMaskId] = useState(
    tileMasks && tileMasks.length > 0 ? tileMasks[0].id : null
  );

  // Handle when a user selects a border
  const handleBorderSelect = (borderImage) => {
    if (selectedBorder === borderImage) {
      setSelectedBorder(null); // Remove border if already selected
    } else {
      setSelectedBorder(borderImage); // Set the selected border
    }
  };

  // Get all unique available colors from masks
  const allAvailableColors = Array.from(
    new Set(tileMasks.flatMap((mask) => mask.availableColors || []))
  );

  const selectedMask = tileMasks.find((mask) => mask.id === selectedMaskId);

  const handlePaletteColorSelect = (paletteColor) => {
    if (!selectedMask) return;
    setTileMaskColor(selectedMask.id, paletteColor);
    setPreviewMode(false);
    setHoveredPaletteColor(null);
  };

  const getMaskColor = (mask) => {
    if (
      previewMode &&
      hoveredPaletteColor &&
      selectedMask &&
      mask.id === selectedMask.id
    ) {
      return hoveredPaletteColor;
    }
    return mask.color;
  };

  const handleMaskLayerClick = (maskId) => {
    setSelectedMaskId(maskId);
    setPreviewMode(false);
    setHoveredPaletteColor(null);
  };

  const handleColorUsedClick = (color) => {
    const maskWithColor = tileMasks.find((mask) => mask.color === color);
    if (maskWithColor) {
      setSelectedMaskId(maskWithColor.id);
    }
  };

  const selectedMaskColor = selectedMask ? selectedMask.color : null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Color Editor</h3>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Editing Tile: {tile.name}</h4>
        {/* Tile Preview */}
        <div className="mb-4 aspect-square max-w-xs mx-auto relative">
          {/* Wrapper for the image and border */}
          <div
            className="relative w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "transparent"
            }}
          >
            {/* Border Mask as overlay (only if selected) */}
            {selectedBorder && (
              <img
                src={selectedBorder}
                alt="Selected Border"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  // borderRadius: "10px",
                  zIndex: 2,
                  objectFit: "cover",
                  // Remove padding!
                }}
              />
            )}

            {/* Tile Image (under the border) */}
            <img
              src={tile.image}
              alt={tile.name}
              className="absolute"
              style={
                selectedBorder
                  ? {
                    width: "55%",
                    height: "60%",
                    zIndex: 1,
                    top: "19%",
                    left: "21%",
                    // right:"30%",
                    position: "absolute",
                    objectFit: "contain",
                  }
                  : {
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    position: "absolute",
                    objectFit: "contain", 
                  }
              }
            />
          </div>
        </div>

        {/* Border Selection */}
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Select a Border</h4>
          <div className="flex gap-2">
            {/* Your list of available borders */}
            {[
              "/Images/borders/Main-Border.png",
            ].map((border, index) => (
              <button
              key={index}
              onClick={() => handleBorderSelect(border)}
              className={`border-2 p-2 ${selectedBorder === border ? "border-blue-500 ring-2 ring-blue-300" : ""}`}
            >
              <img
                src={border}
                alt={`Border ${index + 1}`}
                className="w-16 h-16 object-cover"
              />
            </button>
            ))}
          </div>
        </div>

        {/* Colors Used */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Colors Used</h4>
          <div className="flex flex-wrap gap-2">
            {(tile.colorsUsed || []).map((color, index) => (
              <button
                key={`color-used-${index}-${color}`}
                className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${selectedMaskColor === color
                  ? "border-black ring-2 ring-offset-2 ring-primary"
                  : "border-gray-200 hover:border-primary"
                  }`}
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => handleColorUsedClick(color)}
              />
            ))}
          </div>
        </div>

        {/* Unified Color Palette */}
        <div className="w-full flex flex-wrap justify-center gap-2 bg-gray-100 rounded-lg p-2 shadow-inner">
          {allAvailableColors.map((paletteColor, index) => (
            <button
              key={`palette-color-${index}-${paletteColor}`}
              className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${selectedMaskColor === paletteColor
                ? "border-black ring-2 ring-offset-2 ring-primary"
                : "border-transparent hover:border-gray-400"
                }`}
              style={{ backgroundColor: paletteColor }}
              title={paletteColor}
              onClick={() => handlePaletteColorSelect(paletteColor)}
              onMouseEnter={() => {
                setPreviewMode(true);
                setHoveredPaletteColor(paletteColor);
              }}
              onMouseLeave={() => {
                setPreviewMode(false);
                setHoveredPaletteColor(null);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorEditor;