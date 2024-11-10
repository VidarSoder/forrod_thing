'use client'
import React, { useState } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import './inventory.css'

const ReactGridLayout = WidthProvider(RGL);

// Define the type for the layout items
type LayoutItem = {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
};

const DynamicGridLayout = () => {
    const [layout, setLayout] = useState<LayoutItem[]>([]);
    const [boxCount, setBoxCount] = useState(0);

    // Handle layout change
    const onLayoutChange = (newLayout: Layout[]) => {
        setLayout(newLayout as LayoutItem[]);
    };

    // Add a new box to the layout
    const addBox = () => {
        setBoxCount((prevCount) => prevCount + 1);
        setLayout((prevLayout) => [
            ...prevLayout,
            {
                x: (boxCount * 2) % 12, // Adjust initial x position to avoid stacking
                y: Infinity, // Places it at the bottom of the layout
                w: 2,
                h: 2,
                i: `box-${boxCount}`,
            },
        ]);
    };

    // Render each box in the layout
    const renderBoxes = () =>
        layout.map((box) => (
            <div key={box.i} className="box">
                <div className="box-content">
                    <span className="box-text">Box {box.i}</span>
                    <button
                        className="box-action-button"
                        onClick={() => handleBoxAction(box.i)}
                    >
                        Action
                    </button>
                </div>
            </div>
        ));

    // Placeholder action for box button click
    const handleBoxAction = (boxId: string) => {
        alert(`Action triggered for ${boxId}`);
    };

    return (
        <div className="grid-container">
            <h2>Inventory Layout Editor (Grid-based)</h2>
            <button onClick={addBox} className="add-box-button">
                Add Box
            </button>
            <ReactGridLayout
                className="layout"
                layout={layout}
                onLayoutChange={onLayoutChange}
                cols={12}
                rowHeight={40}
                width={1440} // Increased width for a larger layout area
                verticalCompact={false}
                preventCollision={true}
                isResizable={true}
                isDraggable={true}
            >
                {renderBoxes()}
            </ReactGridLayout>
        </div>
    );
};

export default DynamicGridLayout;
