import { useEffect, useRef } from 'react';

export const AdSense = () => {
    const adRef = useRef<HTMLModElement>(null);
    const isAdPushed = useRef(false);

    useEffect(() => {
        if (isAdPushed.current) return;

        try {
            const adsbygoogle = (window as any).adsbygoogle || [];
            if (adRef.current && adRef.current.innerHTML === '') {
                adsbygoogle.push({});
                isAdPushed.current = true;
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="my-4">
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-2764784359698938"
                data-ad-slot="7217586018"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};
