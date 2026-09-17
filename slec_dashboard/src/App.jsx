import { useEffect } from 'react'

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrEyZVRa-9R5UnFQPMIXgQaiLyLSQAzJOlf5cl6UfZ4RQZK_sQiPW26na23x2_3oca0tt0glMvvHz1NShCz7zmHOclngifFqxvzEuWpckI4fRjbYqP865Brm1tTEGYjiAKTXNfN_qyIfoiXOrmStw3L7o9kZDi-s3OInFZKjdapp8j-9WwHFi6sCE5EdD078KuGVCYH8mGwzSyp1-_pE5P2HsqZ6G2D8lB6UOuamL8lrTZ5Hw3gMhNkA'
const PROFILE_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVrsK5Yo7N5bXd5XzeDYmwizg_8yCLhLH1zHBYTXpYogxZ5sbIjcTSepBs5-y2V6T9USYH209QI-bbS6Gf4lPwsTR9WecJb3bbykldhu2HUgK5LXGpLGPrLSdfyU1Z3G2FMmlZdXAm3Q2GVcETjpFX_xbeIoy5S5vHL0UoeBulrEhHaOb9wQ3kYVTI9ThPX6ty-CL0bVeEyIf_v82vpDRsVk4OMRqk8Jg_u8pgRPupkbr7ge1mJr6csQ'

export default function App() {
  useEffect(() => {
    const dateElement = document.getElementById('live-calendar-date')
    if (dateElement) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const now = new Date()
      dateElement.textContent = now.toLocaleDateString('en-US', options)
    }
  }, [])

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-space-md px-space-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm px-space-xs py-space-2xs">
            <img alt="SLEC System Logo" className="h-8 w-auto object-contain" src={LOGO_SRC} />
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface">SLEC System</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Enterprise Training</span>
            </div>
          </div>
          <div className="h-px w-full bg-surface-container-highest"></div>
          <nav className="flex flex-col gap-space-2xs" data-active-classes="bg-primary-container text-on-primary font-bold">
            <a aria-current="page" className="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors bg-primary-container text-on-primary font-bold" data-path="dashboard" href="#">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body-md text-body-md">Dashboard</span>
            </a>
            <a className="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="training-management" href="#">
              <span className="material-symbols-outlined text-[20px]">model_training</span>
              <span className="font-body-md text-body-md">Training Management</span>
            </a>
            <a className="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="participant-database" href="#">
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="font-body-md text-body-md">Participant Database</span>
            </a>
            <a className="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="assessment" href="#">
              <span className="material-symbols-outlined text-[20px]">fact_check</span>
              <span className="font-body-md text-body-md">Assessment</span>
            </a>
            <a className="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="certificate" href="#">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              <span className="font-body-md text-body-md">Certificate</span>
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-space-sm">
          <div className="bg-surface-container p-space-sm rounded-xl flex flex-col gap-space-2xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface">System Status</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Supabase Cloud Connected</span>
          </div>
          <div className="h-px w-full bg-surface-container-highest"></div>
          <div className="flex items-center gap-space-sm px-space-xs">
            <div className="relative">
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={PROFILE_SRC} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-container-low"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-label-md text-label-md text-on-surface truncate">Administrator</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">SLEC Learning Center</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-space-xl flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-space-md">
            <img alt="SLEC System Logo" className="h-8 w-auto object-contain" src={LOGO_SRC} />
            <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <span className="hover:text-on-surface cursor-pointer">TMS</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-on-surface font-label-md text-label-md">Enterprise Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="relative flex items-center w-72">
              <span className="material-symbols-outlined absolute left-space-xs text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-9 pr-space-sm py-space-2xs bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Search participant, batch, syllabus..." type="search" />
            </div>
            <div className="flex items-center gap-space-xs">
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="font-label-sm text-label-sm text-on-surface hidden xl:inline">Supabase Active</span>
              </div>
              <button className="relative p-space-2xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              </button>
            </div>
            <div className="h-6 w-px bg-surface-container-highest"></div>
            <div className="flex items-center gap-space-xs">
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={PROFILE_SRC} />
              <div className="hidden md:flex flex-col">
                <span className="font-label-md text-label-md text-on-surface leading-tight">System Admin</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">SLEC Learning Center</span>
              </div>
            </div>
          </div>
        </header>
        <main className="w-full pt-16 px-space-xl bg-background">
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-space-xl pb-space-3xl">
              <section className="relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm p-space-xl">
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
                <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-xs max-w-2xl">
                    <div className="flex items-center gap-space-xs">
                      <span className="px-space-xs py-space-2xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">Operational Overview</span>
                      <span className="text-outline text-body-sm">•</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm" id="live-calendar-date">Tuesday, 13 May 2025</span>
                      <span className="text-outline text-body-sm">•</span>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Q2 2025 Training Cycle
                      </div>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                      Welcome back, <span className="text-primary font-headline-lg">Bambang Wijaya</span>
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Lead Training Director • Managing 18 synchronized batches across engineering, compliance, and leadership tracks with real-time Supabase telemetry.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-xs shrink-0">
                    <button className="inline-flex items-center gap-space-2xs px-space-md py-space-xs bg-primary hover:bg-secondary text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm transition-all duration-150 active:scale-95" type="button">
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      <span>+ New Training Batch</span>
                    </button>
                    <button className="inline-flex items-center gap-space-2xs px-space-md py-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg rounded-lg transition-all duration-150 active:scale-95" type="button">
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span>+ Register Participant</span>
                    </button>
                    <button className="inline-flex items-center gap-space-2xs px-space-sm py-space-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm transition-all duration-150" type="button">
                      <span className="material-symbols-outlined text-[18px]">file_download</span>
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                <Card
                  label="Active Batches"
                  value="18"
                  sub="Total"
                  footerLeft="12 Ongoing • 6 Scheduled"
                  footerRight={
                    <span className="inline-flex items-center gap-0.5 text-primary font-bold">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      +15% MoM
                    </span>
                  }
                  bar={
                    <>
                      <div className="h-full bg-primary" style={{ width: '66.6%' }}></div>
                      <div className="h-full bg-secondary-fixed-dim" style={{ width: '33.4%' }}></div>
                    </>
                  }
                  iconBg="bg-secondary-container/50 text-primary"
                  icon={<span className="material-symbols-outlined text-[24px]">model_training</span>}
                />
                <Card
                  label="Total Participants"
                  value="1,248"
                  sub="Enrolled"
                  footerLeft={
                    <div className="flex items-center -space-x-2 overflow-hidden py-1">
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Portrait of Asian corporate male participant smiling in modern office environment with natural daylight and green desk plants" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-PpT2z9EK77sw1hz77Vq9VtNzSAo1cf53HKF3BRuTp-1lq-dImTnpzMuaUJXGMYWUUEg00XVKmU9EIIgstz_2XeHltB6gbhz_2ci4gdniRbgnLaS6mwJWyetfqKf086E_nsw1D26bSl-cS8HAp2OI0XTtsyQGZwJu3GZh2rFmJujwgcFFxWCaFUQ7H7sp_RivAUCgt1QT5xNf_mqZ6IsDrKmUS_OHfSGvqMd0nz29eQ4NzguPoQqL-Q" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Headshot of female tech analyst with glasses in contemporary software learning lab with bright lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKU8kzNIUNWSeSTslOP1-6eVDkFHOv-Hplhzf5BNWvudp743ayaNdXwt1TEyeqn5w3D9NFgSUTLDo2ZxLwZZ-DLrhkLUACB090mVI-XoUkCT2jDhzvNhAG7uPvWnOiX5FP6C01NfIv1JyfOE2_28Oa5GrrchvLOkDxGUMJmEgFgRwdgNyNlo0aB-70VdvHTRRSFlR3LxYvwUGTQIGkMbXP8aTKaSt5M3Qw9CoUbd8nT1-C2Gz-d1qaQQ" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Corporate professional learner in smart casual blazer attending executive seminar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABuM4036z6bYOPPhGQ6WTzYvFTpwHiXolekKhfMcM-Qjs_4zw4kC6ChFPZvGiGwHPpNfe0jJHqBpCOFJ2RV8CYO4lU4RwR3SHYNfvxUULVcKOyrhStPqiBNsq4blEunIf9sz5KB0lBS4gDuC_9xXAbOjmuQ2YvAW6s0X043x1Gq0M58NyWSOGErF8Jw4jbM9xCdcUB6IQ9Kc-NBGtPvnhWiGC_qy-quJUPfFGzoP95i7c-BJPm2-N14Q" />
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest text-on-surface font-label-sm text-[10px] ring-2 ring-surface-container-lowest">+8</span>
                    </div>
                  }
                  footerRight={<span className="font-label-sm text-label-sm text-on-surface-variant">8 Divisions synced</span>}
                  iconBg="bg-surface-container text-on-surface-variant"
                  icon={<span className="material-symbols-outlined text-[24px]">group</span>}
                />
                <Card
                  label="Avg Score"
                  value="86.4"
                  sub="/ 100"
                  footerLeft={
                    <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-primary-fixed-dim/30 text-on-surface font-label-sm text-label-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      92.8% Pass Rate
                    </span>
                  }
                  footerRight={<span className="font-label-sm text-label-sm text-on-surface-variant">Benchmark &gt; 80</span>}
                  iconBg="bg-secondary-container/40 text-primary"
                  icon={<span className="material-symbols-outlined text-[24px]">fact_check</span>}
                />
                <Card
                  label="Certificates Issued"
                  value="892"
                  sub={<span className="font-body-md text-body-md text-primary font-bold">Live</span>}
                  footerLeft={
                    <span className="flex items-center gap-1 text-on-surface font-medium">
                      <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                      Blockchain Stamped
                    </span>
                  }
                  footerRight={<span className="font-label-sm text-label-sm text-on-surface-variant font-mono text-[11px]">SHA-256 Valid</span>}
                  iconBg="bg-tertiary-fixed text-on-tertiary-fixed-variant"
                  icon={<span className="material-symbols-outlined text-[24px]">workspace_premium</span>}
                />
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
                <section className="xl:col-span-7 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between px-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Today's Training Schedule</h2>
                    </div>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">3 Sessions Synchronized</span>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    <ScheduleCard
                      time="09:00"
                      timeVariant="text-primary"
                      badge={
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                          Live Streaming
                        </span>
                      }
                      badgeText="Batch 4 • Engineering Track"
                      title="Full-Stack Web Dev with Supabase & Node.js"
                      location="Vercel Live Classroom #04"
                      participants="42 Participants"
                      trainerImgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDU-xVgrPk9oUETuI3KkF65V7oMUR012lchyOsN6DPbsYQqLqUAogcZCGBvbNLxnp8r20tbA08zKm4SEQi7XDm17sb9xKasJb-tswamBALj_q1xvT01VJYWiZe2ydqOHYsvNCbOW07R_dLmY0yoyclJxBQqbsHTN91HA7wkciLZxy5XrzLkujxwlIrT-L5ulLCL_Y3aU7rNQ707n2JwvNjwJiPLaZJBhUjEB8-XCtYtVK5ehRKOoeDzSQ"
                      trainerName="Arya Pratama"
                      trainerRole="Lead Architect"
                      buttonText="Enter Room"
                      buttonVariant="bg-primary-container text-on-primary hover:bg-secondary"
                    />
                    <ScheduleCard
                      time="13:30"
                      timeVariant="text-on-surface-variant"
                      badge={
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                          Upcoming (1h 15m)
                        </span>
                      }
                      badgeText="Batch 11 • Governance"
                      title="ISO 9001:2015 Quality Compliance Training"
                      location="Auditorium B, SLEC Tower Lt. 3"
                      participants="28 Participants"
                      trainerImgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCiBHJ7PnkGxkJczEJZl_9YHhPk7BYAXm9xlWn4R6uDUURcl1m_uPczclKClLEqUX_mNPQP_tGCGVY9T8Vt3JJv2FoIyxbeeooddVYW7YkdIstuANa2oIwaBaUY7Q07JgxQrxSCok1L34x5b_EQOS9peCIUhl9JYRA8zlDvEcUPPriu8Bqye3ZpQskvjOQ_fb09AX5oFuFJ0jmtro5ueZsunrrDZW4uxjR2TV-5ner2GtY_qc1VakcK2g"
                      trainerName="Dr. Ratna Sari"
                      trainerRole="Lead Auditor"
                      buttonText="View Roster"
                      buttonVariant="bg-surface-container hover:bg-surface-container-high text-on-surface"
                    />
                    <ScheduleCard
                      time="15:00"
                      timeVariant="text-on-surface-variant"
                      badge={
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                          Upcoming (2h 45m)
                        </span>
                      }
                      badgeText="Executive Track • Cohort 2"
                      title="Leadership Acceleration Bootcamp - Module 3"
                      location="Executive Suite Alpha & Zoom Sync"
                      participants="16 Participants"
                      trainerImgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCqX1x2zN15Apjwpla1mRxsXRLaDutA-6gh9m42w25rFEY10sfpvC7EjDk-9in7hv7U2icttGY6opNPj4UQtJINvCKO-jMKzriXj53HCy1iqHFz3cMjBZeV5CAJX77HOf7PswgViO04HffJAnyg-VEl-wmU03E7lh6Lxn194XmX7A0m3xkjE_-ylSwh4ROzU5JFgDeh-u8bZHGAoSelsiPrXKeMQHq8YZIzELAzZ7rBy0jVymng6iHUXg"
                      trainerName="Dimas Dananjaya"
                      trainerRole="Executive Coach"
                      buttonText="Briefing Pack"
                      buttonVariant="bg-surface-container hover:bg-surface-container-high text-on-surface"
                    />
                  </div>
                  <div className="rounded-xl bg-surface-container-low p-space-md flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">calendar_view_week</span>
                      <span className="font-body-md text-body-md text-on-surface">Looking for past attendance sheets & archives?</span>
                    </div>
                    <button className="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-1" type="button">
                      Open Full Timetable
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </section>

                <section className="xl:col-span-5 flex flex-col gap-space-lg">
                  <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Competency Growth</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Average Pre-test vs Post-test by Track</span>
                      </div>
                      <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container text-on-surface">Q2 Cycles</span>
                    </div>
                    <div className="w-full flex flex-col gap-space-sm pt-space-xs">
                      <ProgressRow label="Cloud Architecture & Dev" pre="54%" post="89%" gain="+35%" />
                      <ProgressRow label="Quality Compliance & Auditing" pre="62%" post="91%" gain="+29%" />
                      <ProgressRow label="Strategic Leadership & Negotiation" pre="58%" post="84%" gain="+26%" />
                      <ProgressRow label="Cybersecurity & Data Privacy" pre="45%" post="82%" gain="+37%" />
                    </div>
                    <div className="flex items-center justify-between pt-space-xs font-label-sm text-label-sm text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-outline-variant inline-block"></span>
                        <span>Baseline Entry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
                        <span>Post-Test Mastery</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent System Logs</h2>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    </div>
                    <div className="flex flex-col gap-space-sm">
                      <LogItem
                        iconBg="bg-secondary-container text-on-secondary-container"
                        icon={<span className="material-symbols-outlined text-[16px]">verified</span>}
                        text={<>
                          Certificate <strong className="font-semibold text-primary">#SLEC-2025-9842</strong> minted for <span className="font-medium">Sarah Tan</span>
                        </>}
                        time="Full-Stack Batch 3 • 4 mins ago"
                      />
                      <LogItem
                        iconBg="bg-surface-container-high text-on-surface"
                        icon={<span className="material-symbols-outlined text-[16px]">quiz</span>}
                        text="Pre-Test evaluation module published for Batch 5 ISO Compliance"
                        time="Triggered by Automated Scheduler • 18 mins ago"
                      />
                      <LogItem
                        iconBg="bg-surface-container-high text-on-surface"
                        icon={<span className="material-symbols-outlined text-[16px]">sync</span>}
                        text={<>
                          Batch roster synced from HRIS: <span className="font-medium">+34 participants</span> added to Cohort 2
                        </>}
                        time="Supabase Webhook • 42 mins ago"
                      />
                      <LogItem
                        iconBg="bg-tertiary-fixed text-on-tertiary-fixed-variant"
                        icon={<span className="material-symbols-outlined text-[16px]">grade</span>}
                        text="Trainer evaluation scores finalized for Executive Strategy Bootcamp"
                        time="Score: 4.92/5.00 • 1 hour ago"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-xl bg-surface-container-low p-space-md shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">dns</span>
                    <span className="font-label-lg text-label-lg text-on-surface">Enterprise Infrastructure Health:</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">All production services operating at peak response</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-md">
                    <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-lg bg-surface-container-lowest shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Supabase DB:</span>
                      <span className="font-body-sm text-body-sm text-primary font-medium">Connected (18ms)</span>
                    </div>
                    <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-lg bg-surface-container-lowest shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Node.js Microservices:</span>
                      <span className="font-body-sm text-body-sm text-primary font-medium">Healthy (99.98%)</span>
                    </div>
                    <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-lg bg-surface-container-lowest shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Vercel Edge CDN:</span>
                      <span className="font-body-sm text-body-sm text-secondary font-medium">Global Active</span>
                    </div>
                    <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-lg bg-surface-container-lowest shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">Audit Vault:</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Encrypted</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

function Card({ label, value, sub, footerLeft, footerRight, bar, iconBg, icon }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-space-2xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</span>
          <div className="flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{value}</span>
            <span className="font-body-md text-body-md text-on-surface-variant">{sub}</span>
          </div>
        </div>
        <div className={`p-space-xs rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-space-md flex flex-col gap-space-xs">
        <div className="flex items-center justify-between font-label-sm text-label-sm">
          {typeof footerLeft === 'string' ? <span className="text-on-surface-variant">{footerLeft}</span> : footerLeft}
          {typeof footerRight === 'string' ? <span>{footerRight}</span> : footerRight}
        </div>
        {bar && (
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
            {bar}
          </div>
        )}
      </div>
    </div>
  )
}

function ScheduleCard({ time, timeVariant, badge, badgeText, title, location, participants, trainerImgSrc, trainerName, trainerRole, buttonText, buttonVariant }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
      <div className="flex items-start gap-space-md">
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-surface-container-low shrink-0 text-center`}>
          <span className={`font-label-sm text-label-sm uppercase ${timeVariant}`}>{time}</span>
          <span className="font-title-md text-title-md text-on-surface leading-none">WIB</span>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-space-xs flex-wrap">
            {badge}
            <span className="font-label-sm text-label-sm text-on-surface-variant">{badgeText}</span>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface truncate">{title}</h3>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span className="truncate">{location}</span>
            <span>•</span>
            <span>{participants}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-space-md pt-space-xs sm:pt-0 shrink-0">
        <div className="flex items-center gap-space-xs">
          <img className="w-8 h-8 rounded-full object-cover" data-alt={`Portrait of ${trainerName}`} src={trainerImgSrc} />
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface leading-tight">{trainerName}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{trainerRole}</span>
          </div>
        </div>
        <button className={`px-space-sm py-space-2xs rounded-lg font-label-md text-label-md transition-colors ${buttonVariant}`} type="button">
          {buttonText}
        </button>
      </div>
    </div>
  )
}

function ProgressRow({ label, pre, post, gain }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-label-sm text-label-sm">
        <span className="text-on-surface">{label}</span>
        <span className="text-primary font-bold">{pre} → {post} ({gain})</span>
      </div>
      <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden flex">
        <div className="h-full bg-outline-variant" style={{ width: pre }}></div>
        <div className="h-full bg-primary" style={{ width: post }}></div>
      </div>
    </div>
  )
}

function LogItem({ iconBg, icon, text, time }) {
  return (
    <div className="flex items-start gap-space-sm">
      <div className={`p-1 rounded-md ${iconBg} mt-0.5 shrink-0`}>
        {icon}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-body-sm text-body-sm text-on-surface">{text}</p>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{time}</span>
      </div>
    </div>
  )
}
