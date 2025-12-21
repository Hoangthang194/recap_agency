import { Suspense } from 'react';
import EditPostClient from './EditPostClient';


export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải trang chỉnh sửa...</div>}>
      <EditPostClient />
    </Suspense>
  );
}
