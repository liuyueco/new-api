/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { SVGProps } from 'react'

export function IconGoogle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path
        fill='#4285F4'
        d='M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v2.96h3.89c2.27-2.09 3.53-5.17 3.53-8.83z'
      />
      <path
        fill='#34A853'
        d='M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-2.96c-1.08.72-2.45 1.15-4.04 1.15-3.12 0-5.77-2.11-6.72-4.94H1.26v3.05A11.99 11.99 0 0 0 12 24z'
      />
      <path
        fill='#FBBC05'
        d='M5.28 14.35A7.2 7.2 0 0 1 4.9 12c0-.82.14-1.61.38-2.35V6.6H1.26A12 12 0 0 0 0 12c0 1.93.46 3.75 1.26 5.4l4.02-3.05z'
      />
      <path
        fill='#EA4335'
        d='M12 4.71c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.54 11.54 0 0 0 12 0 11.99 11.99 0 0 0 1.26 6.6l4.02 3.05C6.23 6.82 8.88 4.71 12 4.71z'
      />
    </svg>
  )
}
