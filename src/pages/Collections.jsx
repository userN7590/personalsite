const GROUPS = [
  {
    heading: 'Watches',
    items: [
      ['Seiko', 'automatic'],
      ['Casio A158WA', 'stainless · digital'],
    ],
  },
  {
    heading: 'Ski resorts',
    items: [
      ['Holiday Valley', 'Ellicottville, NY'],
      ['Peek’n Peak', 'Findley Lake, NY'],
      ['Seven Springs', 'Pennsylvania'],
      ['Boyne Mountain', 'Michigan'],
      ['Vail', 'Colorado'],
    ],
  },
  {
    heading: 'Golf courses',
    items: [
      ['Sleepy Hollow', 'Brecksville, OH'],
      ['Manakiki', 'Willoughby Hills, OH'],
      ['Little Mountain', 'Concord, OH'],
      ['Firestone', 'Akron, OH'],
    ],
  },
  {
    heading: 'Travel',
    items: [
      ['Cleveland', 'home'],
      ['Kraków', 'Poland'],
      ['New York', 'NY'],
      ['Miami', 'FL'],
      ['Chicago', 'IL'],
    ],
  },
]

export default function Collections() {
  return (
    <>
      <h1 className="page-title"><span className="num">04</span><span className="t">Collections</span></h1>
      <p className="page-sub">Not a portfolio &mdash; a personal archive. A few things I actually care about.</p>

      <section>
        {GROUPS.map((group) => (
          <div key={group.heading}>
            <div className="coll-h">{group.heading}</div>
            <ul className="plain">
              {group.items.map(([name, loc]) => (
                <li key={name}>{name} <span className="loc">{loc}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
