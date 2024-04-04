import { PROVIDER_URL, SOCIAL_PORTFOLIO_URL } from '@/api'

export function PolicyView() {
  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <div className='container mt-8 mb-16'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Policy</h1>
        <section className='mt-8'>
          <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Overview
          </h2>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            This project is a web application that allows you to watch Movies, TV Shows, Anime in
            one place. It is designed to be a simple and easy-to-use platform that provides a
            YouTube-like player experience. App works by displaying video files from third-party
            providers inside an intuitive and aesthetic user interface. Content is fetched from
            third parties and scraping is fully done on the client. This means that the hoster has
            no files or media on their server. All files are streamed directly from the third
            parties.
          </p>
        </section>
        <section className='mt-8'>
          <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Purpose of Application
          </h2>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            I created this application categorically for the purpose of training and demonstrating
            my skills as a professional in my field. I do not pursue the purpose of distribution or
            sale of copyrighted video content. I don&apos;t host any files, it merely links to 3rd
            party services. Legal issues should be taken up with the file hosts and providers.
            I&apos;m not responsible for any media files shown by the video providers.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            Access to my application is highly restricted and is only available on{' '}
            <b>read-only mode</b>. No one can access the copyrighted video content without my
            permission. Even when access to the site is granted, it is for purely demonstrative
            purposes, and access will be revoked shortly after that. I do not store any copyrighted
            data on my server (more on Privacy section) and do not publicly provide any
            download/streaming links to the content.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            All material and data I take from public sources using Web Scraping. If you are a
            copyright holder and want to remove content from the app you must do so on the{' '}
            <a
              href={`${PROVIDER_URL}/abuse.html`}
              target='_blank'
              rel='noreferrer'
              className='underline-offset-4 underline'
            >
              site providing the data
            </a>
            . I respect the intellectual property of others. If you believe that your work has been
            copied in a way that constitutes copyright infringement, please contact with me in a way
            that is convenient for you using the links on{' '}
            <a
              href={SOCIAL_PORTFOLIO_URL}
              target='_blank'
              rel='noreferrer'
              className='underline-offset-4 underline'
            >
              my website.
            </a>
          </p>
        </section>
        <section className='mt-8'>
          <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Privacy
          </h2>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            In this section, I have described the data that website retrieves/collects and how I use
            it.
          </p>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mt-6'>
            Data that I collect
          </h3>
          <p className='leading-7 [&:not(:first-child)]:mt-3'>
            I only collect and store data on my servers if you are one of the app access holders and
            are registered on the app. All data is deleted the moment you lose access to the site,
            this process is automated. All data is stored in a secure database and is not shared
            with anyone. I do not sell or use any of this data. This data includes:
          </p>
          <ul className='mt-4 ml-6 list-disc [&>li]:mt-2'>
            <li>Email Address</li>
            <li>Fullname</li>
            <li>Avatar Image</li>
            <li>Playback related data</li>
            <li>Watched, Saved, Rated, Favorite movies and shows</li>
          </ul>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mt-6'>
            Third party services
          </h3>
          <p className='leading-7 [&:not(:first-child)]:mt-3'>
            I do not pass your data to third party services, all data is masked behind my proxy
            server,{' '}
            <a
              href={PROVIDER_URL}
              target='_blank'
              rel='noreferrer'
              className='underline-offset-4 underline'
            >
              provider
            </a>{' '}
            does not receive any data about you.
          </p>
        </section>
      </div>
    </div>
  )
}
