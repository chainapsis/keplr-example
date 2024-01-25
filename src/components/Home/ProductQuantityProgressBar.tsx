import React from "react";

interface ProductQuantityProgressBarProps {
  currentQuantity: number;
  maxQuantityPerBlock: number;
}

const ProductQuantityProgressBar: React.FC<ProductQuantityProgressBarProps> = ({
  currentQuantity,
  maxQuantityPerBlock,
}) => {
  const calculateProgress = (): number => {
    const progress = (currentQuantity / maxQuantityPerBlock) * 100;
    return Math.min(progress, 100); // Ensure progress does not exceed 100%
  };

  return (
    <div className="mt-3">
      <p className="text-sm mb-1">Product Quantity Progress:</p>
      <div className="relative pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">
            {currentQuantity}/{maxQuantityPerBlock}
          </span>
        </div>
        <div className="flex mt-2">
          <div className="flex w-full">
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-[#65b9f4] to-[#a172f2] rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuantityProgressBar;
