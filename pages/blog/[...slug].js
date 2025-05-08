import client from '../../lib/apollo';
import {
  GET_ALL_POSTS,
  GET_POST_BY_SLUG,
  GET_PREVIOUS_AND_NEXT_POSTS,
} from '../../lib/queries/posts';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';


export default function Post({ post, previousPost, nextPost }) {
  if (!post) return <p className="post-not-found">Post not found</p>;

  const {
    title,
    content,
    author,
    categories = { nodes: [] },
    featuredImage,
    tags = { nodes: [] },
    date,
    slug,
  } = post;

  const publishDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageSrc = featuredImage?.node?.sourceUrl;
  const imageAlt = featuredImage?.node?.altText || title;
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

  return (
    <main className="post-container">
      {imageSrc && (
        <div className="featured-image">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={800}
            layout="intrinsic"
          />
        </div>
      )}

      <h1 className="post-title">{title}</h1>

      <div className="post-meta">
        <p>
          <strong>Author:</strong> {author?.node?.name || 'Unknown'}
        </p>
        <p>
          <strong>Published:</strong> {publishDate}
        </p>
        <p>
          <strong>Categories:</strong>{' '}
          {categories.nodes.length > 0
            ? categories.nodes.map((cat, i) => (
              <span key={cat.slug}>
                {i > 0 && ', '}
                <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
              </span>
            ))
            : 'Uncategorized'}
        </p>
        {tags.nodes.length > 0 && (
          <p>
            <strong>Tags:</strong>{' '}
            {tags.nodes.map((tag, i) => (
              <span key={tag.slug}>
                {i > 0 && ', '}
                <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>
              </span>
            ))}
          </p>
        )}
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Social Share Links */}
      <div className="social-share">
        <p><strong>Share this post:</strong></p>
        <ul className="social-icons">
          <li>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="facebook"
            >
              <FaFacebookF />
            </a>
          </li>
          <li>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="twitter"
            >
              <FaTwitter />
            </a>
          </li>
          <li>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="linkedin"
            >
              <FaLinkedinIn />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="instagram"
            >
              <FaInstagram />
            </a>
          </li>
        </ul>

        <style jsx>{`
    .social-icons {
      list-style: none;
      padding: 0;
      display: flex;
      gap: 1rem;
      margin: 0.5rem 0;
    }
    .social-icons li a {
      font-size: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    .social-icons li a:hover {
      transform: scale(1.15);
    }
    .facebook {
      color: #1877F2;
    }
    .twitter {
      color: #1DA1F2;
    }
    .linkedin {
      color: #0A66C2;
    }
    .instagram {
      color: #E1306C;
    }
  `}</style>
      </div>


      {/* Navigation */}
      <div className="post-navigation">
        {previousPost?.title && (
          <div className="previous-post">
            <Link href={`/blog/${previousPost.slug}`}>← {previousPost.title}</Link>
          </div>
        )}
        {nextPost?.title && (
          <div className="next-post">
            <Link href={`/blog/${nextPost.slug}`}>{nextPost.title} →</Link>
          </div>
        )}
      </div>


    </main>
  );
}

export async function getStaticPaths() {
  const res = await client.query({ query: GET_ALL_POSTS });

  const paths = res.data.posts.edges
    .map((edge) => edge?.node?.slug)
    .filter(Boolean)
    .map((slug) => ({
      params: { slug: [slug] },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/');
  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });

    if (!data?.post) return { notFound: true };

    return {
      props: { post: data.post },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}
