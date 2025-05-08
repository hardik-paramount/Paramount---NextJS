'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Breadcrumbs() {
  const router = useRouter();
  const { asPath } = router;

  // Don't render breadcrumbs on homepage
  if (asPath === '/' || asPath === '') return null;

  const pathParts = asPath.split('/').filter((part) => part);

  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    const name = decodeURIComponent(part.replace(/-/g, ' '));

    return {
      href,
      name: name.charAt(0).toUpperCase() + name.slice(1),
    };
  });

  return (
    <nav aria-label="breadcrumb" style={{ padding: '10px 20px', background: '#fff' }}>
      <span>
        <Link href="/">Home</Link>
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.href}>
            {' '}
            &raquo;{' '}
            {idx < breadcrumbs.length - 1 ? (
              <Link href={crumb.href}>{crumb.name}</Link>
            ) : (
              <span>{crumb.name}</span>
            )}
          </span>
        ))}
      </span>
    </nav>
  );
}
