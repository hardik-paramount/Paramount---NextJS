import { useState } from 'react';
import client from '../lib/apollo';
import { GET_POSTS } from '../lib/queries/posts';
import Link from 'next/link';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/globals.css'

export default function Home({ posts, pageInfo }) {
  const [postList, setPostList] = useState(posts);
  const [cursor, setCursor] = useState(pageInfo.endCursor);
  const [hasNext, setHasNext] = useState(pageInfo.hasNextPage);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const res = await client.query({
      query: GET_POSTS,
      variables: { first: 6, after: cursor },
    });

    setPostList([...postList, ...res.data.posts.nodes]);
    setCursor(res.data.posts.pageInfo.endCursor);
    setHasNext(res.data.posts.pageInfo.hasNextPage);
    setLoading(false);
  };

  return (
    <>
      {/* Slider Section */}
      <div className="slider-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="post-slider"
        >
          {posts.slice(0, 5).map((post) => {
            const image = post.featuredImage?.node?.sourceUrl;
            const postUrl = `/blog/${post.slug}`;
            const category = post.categories.nodes[0]?.name;
            const categorySlug = post.categories.nodes[0]?.slug;

            return (
              <SwiperSlide key={post.id}>
                <div className="slider-card">
                  {image && (
                    <Image
                      src={image}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  )}
                  <div className="slider-content">
                    {category && (
                      <Link href={`/category/${categorySlug}`} className="slider-category" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
                        {category}
                      </Link>
                    )}
                    <h2>
                      <Link href={postUrl} style={{ color: '#fff', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="meta" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
                      By {post.author?.node?.name || 'Unknown'} | {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Post Grid Section */}
        <h2 style={{textAlign:'center',fontSize:'30px', color: '#000'}}>Trending Posts</h2>
      <div className="grid-container">
        {postList.map((post) => (
          <div className="post-card" key={post.id}>
            {post.featuredImage?.node?.sourceUrl && (
              <Link href={`/blog/${post.slug}`}>
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="post-image"
                />
              </Link>
            )}

            <Link href={`/blog/${post.slug}`} style={{ color: '#000', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
              {post.title}
            </Link>

            <p className="meta">
              By {post.author?.node?.name || 'Unknown'} | {new Date(post.date).toLocaleDateString()}
            </p>
            <p>
              {post.categories.nodes[0]?.name && (
                <Link href={`/category/${post.categories.nodes[0]?.slug}`} className="slider-category-grid" style={{ 'color': '#fff', 'textDecoration': 'none', 'backgroundColor': '#0070f3', 'padding': '10px', 'border-radius': '5px' }}>
                  {post.categories.nodes[0]?.name}
                </Link>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasNext && (
        <div className="load-more-wrapper">
          <button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
      .meta {
          font-size: 0.9rem;
          color: #000;
          margin-top: 15px;
          margin-bottom: 15px;
        }
        .slider-container {
          width: 100%;
          height: 500px;
          position: relative;
          margin-bottom: 2rem;
        }

        .slider-card {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 12px;
          overflow: hidden;
        }

        .slider-content {
          position: absolute;
          bottom: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          color: white;
          width: 100%;
          z-index: 2;
          }
          
        .swiper .swiper-wrapper .slider-content h2 a{
            color: #fff !important;
        }

        .slider-category {
          background: #fff;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          display: inline-block;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .post-card {
          background: #fff;
          border: 1px solid #eee;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .post-image {
          border-radius: 8px;
          object-fit: cover;
          width: 100%;
          height: 250px;
        }

        .load-more-wrapper {
          text-align: center;
          margin: 2rem 0;
        }

        button {
          padding: 0.75rem 2rem;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button:disabled {
          background-color: #ccc;
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const res = await client.query({
    query: GET_POSTS,
    variables: {
      first: 6,
      after: null,
    },
  });

  return {
    props: {
      posts: res.data.posts.nodes,
      pageInfo: res.data.posts.pageInfo,
    },
    revalidate: 60,
  };
}
