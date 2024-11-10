// app/(auth)/inventory/page.js
import dynamic from "next/dynamic";

const InventoryPage = dynamic(() => import("./component"), {
    ssr: false,
});

export default InventoryPage;
