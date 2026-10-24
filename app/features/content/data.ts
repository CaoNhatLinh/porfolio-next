import type { Locale, Profile, Project } from "./types";
import { articles as richArticles } from "./articles-content";

export const profile: Profile = {
  "name": "Cao Nhật Linh",
  "shortName": "Linh",
  "title": {
    "vi": "Lập trình viên full-stack",
    "en": "Full-stack developer"
  },
  "intro": {
    "vi": "Tôi là Linh, lập trình viên full-stack. Tôi làm web và ứng dụng mobile, từ giao diện đến API và dữ liệu.",
    "en": "I'm Linh, a full-stack developer working on web and mobile apps, including interfaces, APIs, and data."
  },
  "bio": {
    "vi": "Tôi thích hiểu quy trình thực tế trước khi bắt tay vào code: ai dùng sản phẩm, họ cần làm gì và có thể gặp lỗi ở đâu. Các dự án bên dưới ghi lại phần tôi đã làm và những quyết định kỹ thuật trong quá trình đó.",
    "en": "I like to understand the workflow before writing code: who uses the product, what they need to do, and where things can go wrong. The projects below describe my work and the technical decisions behind it."
  },
  "email": "caonhatlinh1312@gmail.com",
  "image": "/media/profile.jpg",
  "location": "Ho Chi Minh City, Vietnam",
  "availability": {
    "vi": "Sẵn sàng trao đổi về công việc và dự án mới",
    "en": "Open to discussing roles and new projects"
  },
  "resumeUrl": "",
  "resumeUpdatedAt": "2026-08-29",
  "responseTime": {
    "vi": "Thường phản hồi trong 2 ngày làm việc",
    "en": "Usually replies within two working days"
  },
  "engagementModes": [
    "full-time",
    "freelance",
    "consulting",
    "conversation"
  ],
  "socials": [
    {
      "label": "GitHub",
      "href": "https://github.com/CaoNhatLinh"
    }
  ],
  "seo": {
    "title": "Cao Nhật Linh | Full-stack developer",
    "description": "Cao Nhật Linh — full-stack developer. Web and mobile projects, technical notes, and work experience."
  }
};

export const projects: Project[] = [
  {
    "slug": "novachat",
    "title": "NovaChat",
    "category": "Backend system",
    "summary": {
      "vi": "Ứng dụng chat realtime với frontend Next.js và backend Spring Boot. Tôi xây phần nhắn tin và tổ chức các thành phần lưu trữ, tìm kiếm, xử lý sự kiện.",
      "en": "A realtime chat app with a Next.js frontend and Spring Boot backend. My work covers messaging, storage, search, and event processing."
    },
    "year": "2026",
    "role": {
      "vi": "Thiết kế và phát triển độc lập",
      "en": "Independent design and development"
    },
    "duration": "2026 — hiện tại",
    "teamContext": {
      "vi": "Dự án độc lập / đang phát triển",
      "en": "Independent project / in active development"
    },
    "stack": [
      "Java",
      "Spring Boot 3",
      "Next.js 16",
      "TypeScript",
      "Apache Cassandra",
      "Redis",
      "Kafka",
      "Elasticsearch",
      "STOMP"
    ],
    "image": "/media/novachat-cover-v1.png",
    "isFeatured": true,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/ChatApp"
      }
    ],
    "outcome": {
      "vi": "NovaChat đang được phát triển. Tôi dùng dự án này để làm sâu hơn phần backend của ứng dụng chat: dữ liệu tin nhắn, kết nối realtime và cách các service phối hợp.",
      "en": "NovaChat is in active development. It is where I work through chat backend concerns: message data, realtime connections, and communication between services."
    },
    "proofLinks": [
      {
        "label": "Repository README",
        "href": "https://github.com/CaoNhatLinh/ChatApp#readme"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Tách trách nhiệm của từng phần",
          "en": "Separate responsibilities"
        },
        "detail": {
          "vi": "Tôi tách phần lưu tin nhắn, trạng thái realtime và tìm kiếm. Khi cần sửa một phần, tôi có thể xem nó nhận dữ liệu từ đâu và ảnh hưởng đến phần nào, thay vì lần theo toàn bộ ứng dụng.",
          "en": "I separate message storage, realtime state, and search. That gives me a specific place to investigate a change and its effects, rather than tracing the whole application."
        }
      },
      {
        "title": {
          "vi": "Xử lý tin nhắn realtime",
          "en": "Realtime messaging"
        },
        "detail": {
          "vi": "Tôi dùng STOMP cho trao đổi qua kết nối realtime. Phần cần phản hồi ngay cho người dùng và phần xử lý sự kiện phía backend được mô tả riêng, vì chúng có cách xử lý lỗi khác nhau.",
          "en": "I use STOMP for realtime communication. Immediate client feedback and backend event processing are treated separately because their failure cases differ."
        }
      },
      {
        "title": {
          "vi": "Tài liệu API và sự kiện",
          "en": "API and event documentation"
        },
        "detail": {
          "vi": "OpenAPI và AsyncAPI giúp tôi ghi lại request, response và sự kiện giữa các thành phần. Đây cũng là chỗ để kiểm tra frontend và backend có đang hiểu cùng một cấu trúc dữ liệu hay không.",
          "en": "OpenAPI and AsyncAPI document requests, responses, and events between components. They also help check that the frontend and backend agree on data structures."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Tôi đang xây gì?",
          "en": "What I'm building"
        },
        "body": {
          "vi": "NovaChat là dự án chat realtime trong một monorepo. Frontend dùng Next.js, còn chat service dùng Spring Boot. Tôi đang phát triển dự án, nên phần trình bày ở đây mô tả cấu trúc và phạm vi hiện tại, không phải kết quả vận hành ở quy mô production.",
          "en": "NovaChat is a realtime chat project in a monorepo, with Next.js on the frontend and Spring Boot for the chat service. This case study describes the current implementation and scope, not production-scale results."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Cách tổ chức backend",
          "en": "Backend structure"
        },
        "body": {
          "vi": "Trong repository, Cassandra lưu dữ liệu chat, Redis phục vụ trạng thái realtime, Kafka xử lý sự kiện và Elasticsearch phục vụ tìm kiếm. Tôi tách các trách nhiệm này để không buộc một database hoặc service xử lý mọi nhu cầu. Đổi lại, tôi phải chú ý đến đồng bộ dữ liệu và cách lần theo lỗi giữa các thành phần.",
          "en": "The repository assigns chat data to Cassandra, realtime state to Redis, events to Kafka, and search to Elasticsearch. Separating them avoids making one service handle every requirement. The trade-off is more work on data synchronization and debugging across components."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Điều tôi tập trung",
          "en": "What I'm working on"
        },
        "body": {
          "vi": "Với dự án này, tôi tập trung vào việc giải thích được từng lựa chọn trong kiến trúc: dữ liệu nào cần lưu, trạng thái nào chỉ tồn tại tạm thời và điều gì xảy ra khi một thành phần lỗi. Tôi không xem việc dùng nhiều công nghệ là kết quả; điều quan trọng là biết chúng giải quyết phần nào của bài toán.",
          "en": "My focus is being able to explain each architectural choice: what needs to persist, what is temporary, and what happens when a component fails. The number of technologies is not the result; knowing what each one is responsible for is."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "social-publishing-platform",
    "title": "Social Publishing Platform",
    "category": "Web application",
    "summary": {
      "vi": "Công cụ quản lý nội dung đa kênh: soạn bài, chọn media, lên lịch, duyệt bài và theo dõi tiến trình đăng trong cùng một ứng dụng.",
      "en": "A multi-channel content tool for composing posts, selecting media, scheduling, approvals, and publishing progress."
    },
    "year": "2025–2026",
    "role": {
      "vi": "Thiết kế và phát triển độc lập",
      "en": "Independent design and development"
    },
    "duration": "12/2025 — 03/2026",
    "teamContext": {
      "vi": "Dự án độc lập / repository công khai",
      "en": "Independent project / public repository"
    },
    "stack": [
      "React",
      "Vite",
      "TypeScript",
      "Node.js",
      "Express",
      "Firebase",
      "Socket.IO",
      "Cloudinary",
      "Gemini AI",
      "Redis"
    ],
    "image": "/media/platforms-manage-cover-v2.png",
    "isFeatured": true,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/platforms-manage"
      }
    ],
    "gallery": [
      {
        "src": "/media/platforms-manage-cover-v2.png",
        "alt": "Social Publishing Platform — editorial product workflow concept"
      }
    ],
    "outcome": {
      "vi": "Tôi xây một quy trình từ soạn bài đến lên lịch và theo dõi trạng thái, để người dùng không phải chuyển qua nhiều màn hình chỉ để biết bài nào cần xử lý.",
      "en": "I built a workflow from composing to scheduling and checking status, so users can see which posts need attention without piecing together separate screens."
    },
    "proofLinks": [
      {
        "label": "Repository README",
        "href": "https://github.com/CaoNhatLinh/platforms-manage#readme"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Soạn bài và lên lịch",
          "en": "Composition and scheduling"
        },
        "detail": {
          "vi": "Composer, lịch nội dung và kho media được kết nối trong cùng luồng. Tôi chú ý đến việc người dùng có thể xem lại nội dung, thời gian và kênh đăng trước khi xác nhận.",
          "en": "The composer, calendar, and media library share a workflow. Users can review the content, time, and destination before confirming."
        }
      },
      {
        "title": {
          "vi": "Theo dõi trạng thái đăng",
          "en": "Publishing status"
        },
        "detail": {
          "vi": "Tác vụ đăng bài không phải lúc nào cũng hoàn thành ngay. Tôi dùng Socket.IO để cập nhật tiến trình, thay vì để người dùng phải tải lại trang hoặc đoán tác vụ đã chạy xong chưa.",
          "en": "Publishing jobs do not always finish immediately. Socket.IO updates progress so users do not have to reload the page to check a job."
        }
      },
      {
        "title": {
          "vi": "Điều phối tác vụ",
          "en": "Job coordination"
        },
        "detail": {
          "vi": "Phần lên lịch hàng loạt cần tính đến các tác vụ chạy cùng lúc. Repository có Redis và cơ chế khóa tác vụ để xử lý phần điều phối; đây là một phần backend tôi quan tâm bên cạnh giao diện soạn bài.",
          "en": "Bulk scheduling needs to account for concurrent jobs. The repository includes Redis and task locking for coordination, alongside the posting interface."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Nhu cầu của người dùng",
          "en": "The workflow"
        },
        "body": {
          "vi": "Khi quản lý nội dung cho nhiều kênh, người dùng phải theo dõi cả bài viết, hình ảnh, lịch đăng và trạng thái duyệt. Tôi tổ chức các phần đó quanh một bài viết, để có thể kiểm tra nó đang ở bước nào và cần làm gì tiếp theo.",
          "en": "Managing content across channels involves posts, media, schedules, and approval status. I organize those details around each post so users can check its current step and next action."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Phần tôi triển khai",
          "en": "Implementation"
        },
        "body": {
          "vi": "Frontend dùng React, Vite và TypeScript; API dùng Node.js và Express. Firebase phục vụ dữ liệu, Cloudinary xử lý media, Socket.IO cập nhật tiến trình và Redis hỗ trợ điều phối tác vụ. Tôi nối các phần này với composer, calendar, media library và luồng duyệt, thay vì làm chúng thành những tính năng rời nhau.",
          "en": "The frontend uses React, Vite, and TypeScript; the API uses Node.js and Express. Firebase handles data, Cloudinary handles media, Socket.IO updates progress, and Redis supports job coordination. These connect to the composer, calendar, media library, and approval flow."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Điểm cần chú ý",
          "en": "Integration limits"
        },
        "body": {
          "vi": "Mỗi nền tảng có yêu cầu API và quyền truy cập riêng. Vì vậy, tôi phân biệt việc đã xây luồng tích hợp trong code với việc kênh đó đã được cấp quyền để đăng thật. Repository là nơi xem phạm vi triển khai; tôi không dùng số lượt đăng hay số người dùng chưa được xác nhận để mô tả dự án.",
          "en": "Each platform has its own API requirements and access permissions. An integration in code is not the same as an account authorized for live publishing. The repository documents implementation scope; this case study does not claim unverified usage figures."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "squareup",
    "title": "SquareUp",
    "category": "Web application",
    "summary": {
      "vi": "Ứng dụng quản lý nhiều nhà hàng, gồm thực đơn, đơn hàng, nhân sự và trang đặt món cho khách.",
      "en": "A multi-restaurant app with menu management, orders, staff roles, and a customer ordering site."
    },
    "year": "2025",
    "role": {
      "vi": "Thiết kế và phát triển độc lập",
      "en": "Independent design and development"
    },
    "duration": "2025",
    "teamContext": {
      "vi": "Dự án độc lập / repository công khai",
      "en": "Independent project / public repository"
    },
    "stack": [
      "React 19",
      "Vite",
      "Node.js",
      "Express 5",
      "Firebase",
      "Stripe",
      "Zustand"
    ],
    "image": "/media/squareup-cover-v1.png",
    "isFeatured": false,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/squareup"
      }
    ],
    "gallery": [
      {
        "src": "/media/squareup-operations-flow-v2.png",
        "alt": "SquareUp — restaurant order, kitchen, menu, and checkout workflow concept"
      }
    ],
    "outcome": {
      "vi": "Tôi kết nối trang đặt món với phần quản trị để thực đơn, đơn hàng và quyền của từng vai trò được xử lý trong cùng hệ thống.",
      "en": "I connected customer ordering with restaurant administration, covering menus, orders, and role-specific access in one system."
    },
    "proofLinks": [
      {
        "label": "Repository README",
        "href": "https://github.com/CaoNhatLinh/squareup#readme"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Từ thực đơn đến đơn hàng",
          "en": "From menu to order"
        },
        "detail": {
          "vi": "Tôi xử lý luồng chọn món, xem giỏ hàng và checkout bên cạnh phần quản lý đơn. Người quản lý cần xem được thông tin khách vừa gửi, không phải nhập lại ở một chỗ khác.",
          "en": "The flow covers selecting items, reviewing the cart, and checking out, alongside order management. Operators need the details submitted by the customer without re-entering them."
        }
      },
      {
        "title": {
          "vi": "Quyền theo vai trò",
          "en": "Role-based access"
        },
        "detail": {
          "vi": "Khách hàng và nhân sự nhà hàng có những thao tác khác nhau. Tôi tổ chức giao diện và dữ liệu theo vai trò, để không lẫn phần đặt món với phần quản lý.",
          "en": "Customers and restaurant staff need different actions. I organize interfaces and data around their roles, separating ordering from administration."
        }
      },
      {
        "title": {
          "vi": "Frontend, API và thanh toán",
          "en": "Frontend, API, and payments"
        },
        "detail": {
          "vi": "React và Zustand xử lý UI và state phía client; Node/Express xử lý API, với Firebase và Stripe ở các phần tích hợp. Tôi chú ý đến trạng thái đơn trước và sau checkout, không chỉ nút thanh toán.",
          "en": "React and Zustand handle the UI and client state, while Node/Express provides APIs with Firebase and Stripe integrations. Order state before and after checkout matters as much as the payment button."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Phạm vi dự án",
          "en": "Project scope"
        },
        "body": {
          "vi": "SquareUp gồm phần quản lý nhiều nhà hàng và storefront cho khách đặt món. Các phần chính là thực đơn, đơn hàng, vai trò nhân sự và checkout. Đây là dự án trong portfolio của tôi; tên dự án không có nghĩa là tôi làm việc cho Square.",
          "en": "SquareUp includes multi-restaurant administration and a customer storefront. The main areas are menus, orders, staff roles, and checkout. It is a portfolio project, not a claim of employment at Square."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Cách tôi nối các phần",
          "en": "Connecting the workflows"
        },
        "body": {
          "vi": "Tôi xây giao diện bằng React, quản lý state bằng Zustand và API bằng Node/Express. Điểm cần chú ý là dữ liệu khách nhìn thấy trên storefront phải phù hợp với dữ liệu đang được quản lý ở admin. Khi menu hoặc đơn hàng thay đổi, từng màn hình phải phản ánh đúng trạng thái tương ứng.",
          "en": "I use React for interfaces, Zustand for state, and Node/Express for APIs. Customer-facing menu data needs to agree with restaurant administration. Changes to menus or orders must be reflected in the relevant screens."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Điều tôi rút ra",
          "en": "What I learned"
        },
        "body": {
          "vi": "Làm một ứng dụng có nhiều vai trò buộc tôi phải nghĩ kỹ hơn về quyền truy cập và trạng thái đơn hàng. Một màn hình hoàn thành chưa có nghĩa là cả luồng hoàn thành: tôi còn phải kiểm tra dữ liệu đi qua API, được lưu thế nào và xuất hiện ra sao ở phía người dùng khác.",
          "en": "An app with multiple roles made me think more carefully about access and order states. Finishing a screen does not finish the workflow: data still needs to pass through the API, be stored, and appear correctly for the other user."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "tutor-connect",
    "title": "Tutor Connect",
    "category": "Mobile application",
    "summary": {
      "vi": "Ứng dụng mobile cho người học và gia sư: tìm kiếm, xem hồ sơ, đặt lịch học và nhắn tin.",
      "en": "A mobile app for learners and tutors, with discovery, profiles, lesson bookings, and messaging."
    },
    "year": "2025",
    "role": {
      "vi": "Thiết kế và phát triển độc lập",
      "en": "Independent design and development"
    },
    "duration": "2025",
    "teamContext": {
      "vi": "Độc lập / sản phẩm cá nhân",
      "en": "Independent / personal product"
    },
    "stack": [
      "React Native",
      "Expo",
      "TypeScript",
      "Expo Router",
      "Zustand",
      "STOMP"
    ],
    "image": "/media/tutor-connect-portfolio-v2.png",
    "isFeatured": true,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/ket-noi-gia-su-mobile"
      }
    ],
    "gallery": [
      {
        "src": "/media/tutor-connect-portfolio-v2.png",
        "alt": "Tutor Connect — redesigned mobile workflow concept"
      }
    ],
    "outcome": {
      "vi": "Tôi phát triển các luồng tìm gia sư, đặt lịch và trao đổi trên mobile, với hai vai trò người học và người dạy.",
      "en": "I developed mobile flows for finding tutors, booking lessons, and messaging, covering both learner and tutor roles."
    },
    "proofLinks": [
      {
        "label": "Case study",
        "href": "/work/tutor-connect"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Hai vai trò người dùng",
          "en": "Learners and tutors"
        },
        "detail": {
          "vi": "Tôi xử lý nhu cầu của cả người học và gia sư. Cùng một lịch học nhưng mỗi bên cần xem thông tin và thực hiện thao tác khác nhau.",
          "en": "I handle both learner and tutor needs. They share a lesson booking, but need different information and actions."
        }
      },
      {
        "title": {
          "vi": "Đặt lịch trên mobile",
          "en": "Mobile booking"
        },
        "detail": {
          "vi": "Luồng đi từ tìm gia sư, xem hồ sơ đến chọn lịch và theo dõi buổi học. Tôi giữ các bước liên quan gần nhau để người dùng có thể kiểm tra lại trước khi đặt.",
          "en": "The flow goes from discovery and profiles to scheduling and lesson tracking. Related information stays together so users can review a booking."
        }
      },
      {
        "title": {
          "vi": "Chat và thông báo",
          "en": "Chat and notifications"
        },
        "detail": {
          "vi": "STOMP hỗ trợ chat realtime. Tôi kết hợp phần nhắn tin với thông báo và trạng thái lịch học để người dùng biết khi có cập nhật, thay vì chỉ kiểm tra một danh sách tĩnh.",
          "en": "STOMP supports realtime chat. Messaging, notifications, and lesson status help users follow updates rather than checking a static list."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Ứng dụng phục vụ ai?",
          "en": "Who it's for"
        },
        "body": {
          "vi": "Tutor Connect phục vụ người học muốn tìm gia sư và gia sư muốn quản lý lịch, trao đổi với học viên. Tôi phát triển ứng dụng bằng React Native và Expo, với Expo Router cho điều hướng và Zustand cho state phía client.",
          "en": "Tutor Connect serves learners looking for tutors and tutors managing lessons and communication. I develop it with React Native and Expo, using Expo Router for navigation and Zustand for client state."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Phần tôi làm",
          "en": "My implementation"
        },
        "body": {
          "vi": "Các luồng trong repository gồm hồ sơ, lịch học, chat STOMP, payment/invoice, đánh giá, đa ngôn ngữ và thông báo realtime. Tôi chú ý đến sự liên kết giữa các màn hình: xem hồ sơ xong phải đặt được lịch, đặt lịch xong phải xem lại được thông tin và tiếp tục trao đổi.",
          "en": "The repository covers profiles, schedules, STOMP chat, payment/invoice, ratings, localization, and realtime notifications. I focus on how screens connect: from a profile to a booking, then reviewing details and continuing the conversation."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Bài học từ mobile",
          "en": "What mobile taught me"
        },
        "body": {
          "vi": "Trên màn hình nhỏ, thêm một field hay một bước điều hướng đều làm người dùng phải thao tác nhiều hơn. Dự án giúp tôi thực hành cách nhóm thông tin, giữ state khi chuyển màn hình và xử lý các trạng thái chờ hoặc lỗi mà không làm mất dữ liệu đang nhập.",
          "en": "On a small screen, every extra field or navigation step adds work. This project gave me practice grouping information, preserving state between screens, and handling loading or errors without losing entered data."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "zing-music",
    "title": "Zing Music",
    "category": "Mobile application",
    "summary": {
      "vi": "Dự án học React Native và Expo qua một ứng dụng nghe nhạc, với playlist, màn hình khám phá và player.",
      "en": "A React Native and Expo learning project built around playlists, music discovery, and a player."
    },
    "year": "2023",
    "role": {
      "vi": "Phát triển giao diện",
      "en": "Interface development"
    },
    "duration": "2023",
    "teamContext": {
      "vi": "Độc lập / exploration",
      "en": "Independent / exploration"
    },
    "stack": [
      "React Native",
      "Expo",
      "Firebase"
    ],
    "image": "/media/zing-music-portfolio-v2.png",
    "isFeatured": false,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/ZingMusic"
      }
    ],
    "outcome": {
      "vi": "Tôi dùng dự án này để thực hành giao diện mobile và state của player: bài đang phát, playlist đang xem và thao tác điều khiển nhạc.",
      "en": "I used this project to practice mobile interfaces and player state: the current track, the playlist being viewed, and playback controls."
    },
    "proofLinks": [
      {
        "label": "Case study",
        "href": "/work/zing-music"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Player và playlist",
          "en": "Player and playlists"
        },
        "detail": {
          "vi": "Tôi tổ chức phần khám phá nhạc và phần điều khiển bài đang phát để người dùng có thể chuyển qua lại mà vẫn biết đang nghe bài nào.",
          "en": "I organize discovery and playback controls so users can browse while still identifying the current track."
        }
      },
      {
        "title": {
          "vi": "State khi đổi màn hình",
          "en": "State across screens"
        },
        "detail": {
          "vi": "Chọn bài, mở player và quay lại playlist là các thao tác liên quan. Tôi thực hành quản lý state để giao diện không hiển thị những thông tin khác nhau về cùng một bài hát.",
          "en": "Choosing a track, opening the player, and returning to a playlist are connected actions. I practice keeping those views consistent."
        }
      },
      {
        "title": {
          "vi": "Bố cục mobile",
          "en": "Mobile layout"
        },
        "detail": {
          "vi": "Danh sách nhạc có nhiều ảnh và chữ. Tôi cân đối kích thước artwork, tên bài và vùng chạm để nội dung dễ đọc mà các nút vẫn dễ dùng.",
          "en": "Music lists combine images and text. I balance artwork, titles, and touch targets so the content remains readable and controls usable."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Mục đích",
          "en": "Why I built it"
        },
        "body": {
          "vi": "Zing Music là dự án học tập, lấy ứng dụng nghe nhạc làm bài thực hành React Native. Tên gọi thể hiện nguồn tham khảo giao diện, không phải sản phẩm chính thức hay công việc của tôi tại Zing.",
          "en": "Zing Music is a learning project using a music app to practice React Native. The name refers to its interface inspiration, not an official product or employment at Zing."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Cách triển khai",
          "en": "Implementation"
        },
        "body": {
          "vi": "Tôi dùng React Native, Expo và Firebase. Phần tôi tập trung là navigation, hiển thị playlist và state của player. Tôi xem các thao tác duyệt nhạc, chọn bài và mở player như một luồng liên tục, không chỉ làm từng màn hình riêng.",
          "en": "I use React Native, Expo, and Firebase, focusing on navigation, playlists, and player state. Browsing, selecting a track, and opening the player are treated as a connected flow."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Điều tôi học được",
          "en": "What I learned"
        },
        "body": {
          "vi": "Đây là dịp tôi luyện những phần cơ bản nhưng dễ làm thiếu trên mobile: vùng chạm đủ lớn, danh sách dễ đọc và trạng thái nhất quán khi chuyển màn hình. Tôi cũng học cách dùng animation vừa đủ để thấy thao tác đã có phản hồi, không làm chậm việc điều khiển nhạc.",
          "en": "I practiced mobile basics that are easy to miss: usable touch targets, readable lists, and consistent state between screens. I also learned to use animation for feedback without delaying playback controls."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "motorcycle-store",
    "title": "Motorcycle Store",
    "category": "Web application",
    "summary": {
      "vi": "Website giới thiệu và bán xe trong một đồ án frontend, gồm danh sách sản phẩm, trang chi tiết và giỏ hàng.",
      "en": "A frontend coursework project for a motorcycle shop, with product listings, detail pages, and a cart."
    },
    "year": "2022",
    "role": {
      "vi": "Frontend developer",
      "en": "Frontend developer"
    },
    "duration": "2022",
    "teamContext": {
      "vi": "Độc lập / coursework",
      "en": "Independent / coursework"
    },
    "stack": [
      "HTML",
      "CSS",
      "Bootstrap"
    ],
    "image": "/media/motorcycle-store-portfolio-v2.png",
    "isFeatured": false,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/GUI_WebBanXeMay"
      }
    ],
    "outcome": {
      "vi": "Tôi hoàn thành luồng giao diện từ xem danh sách xe đến trang chi tiết và giỏ hàng bằng HTML, CSS và Bootstrap.",
      "en": "I built the interface flow from motorcycle listings to product details and the cart using HTML, CSS, and Bootstrap."
    },
    "proofLinks": [
      {
        "label": "Case study",
        "href": "/work/motorcycle-store"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Trang chi tiết sản phẩm",
          "en": "Product detail pages"
        },
        "detail": {
          "vi": "Tôi nhóm hình ảnh, thông số và lựa chọn sản phẩm để người xem có thể tìm thông tin trước khi thêm vào giỏ.",
          "en": "I group images, specifications, and product options so visitors can review an item before adding it to the cart."
        }
      },
      {
        "title": {
          "vi": "Bố cục responsive",
          "en": "Responsive layout"
        },
        "detail": {
          "vi": "Tôi dùng grid của Bootstrap cùng CSS để điều chỉnh bố cục trên màn hình nhỏ. Tôi kiểm tra cả ảnh, chữ và các nút, không chỉ thu nhỏ phiên bản desktop.",
          "en": "I use Bootstrap's grid and CSS to adapt the layout to smaller screens, checking images, text, and controls rather than shrinking the desktop page."
        }
      },
      {
        "title": {
          "vi": "HTML và CSS cơ bản",
          "en": "HTML and CSS foundations"
        },
        "detail": {
          "vi": "Dự án giúp tôi thực hành cấu trúc HTML, spacing và các component dùng lại. Đây là phần nền tảng trước khi tôi chuyển sang các ứng dụng React phức tạp hơn.",
          "en": "The project gave me practice with HTML structure, spacing, and reusable components before moving to more complex React applications."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Phạm vi đồ án",
          "en": "Coursework scope"
        },
        "body": {
          "vi": "Motorcycle Store là đồ án frontend về website bán xe. Tôi làm các màn hình danh sách, chi tiết sản phẩm và giỏ hàng. Phần trình bày này tập trung vào giao diện; không mô tả nó như một hệ thống thanh toán hay cửa hàng đang vận hành thực tế.",
          "en": "Motorcycle Store is frontend coursework for a motorcycle shop. I build listing, detail, and cart screens. This case study covers the interface, not a live store or payment system."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Cách tôi làm",
          "en": "Implementation"
        },
        "body": {
          "vi": "Tôi dùng HTML, CSS và Bootstrap để tổ chức trang. Ở trang chi tiết, hình xe, thông số và thao tác thêm vào giỏ được nhóm theo nội dung liên quan. Trên mobile, các khối được sắp xếp lại để người dùng không phải kéo ngang mới đọc hết thông tin.",
          "en": "I use HTML, CSS, and Bootstrap. Product images, specifications, and cart actions are grouped by relevance. On mobile, the layout is rearranged so visitors do not need horizontal scrolling to read it."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Bài học",
          "en": "What I learned"
        },
        "body": {
          "vi": "Stack của đồ án khá đơn giản, nhưng buộc tôi tự xử lý layout và responsive thay vì dựa vào component có sẵn. Tôi học cách kiểm tra khoảng cách, kích thước ảnh và thứ tự thông tin bằng nội dung thật, không chỉ bằng một bản mockup đẹp.",
          "en": "The simple stack made me work directly on layout and responsiveness rather than rely on ready-made components. I learned to check spacing, image sizes, and information order with actual content."
        },
        "tone": "accent"
      }
    ]
  },
  {
    "slug": "bus-management",
    "title": "Bus Management",
    "category": "Backend system",
    "summary": {
      "vi": "Đồ án quản lý và đặt vé xe bằng C#/.NET, SQL Server, gồm thông tin chuyến, sơ đồ ghế và hành khách.",
      "en": "A C#/.NET and SQL Server coursework project for bus management and ticket booking, covering trips, seats, and passenger details."
    },
    "year": "2021",
    "role": {
      "vi": "Phát triển hệ thống",
      "en": "System development"
    },
    "duration": "2021",
    "teamContext": {
      "vi": "Độc lập / coursework",
      "en": "Independent / coursework"
    },
    "stack": [
      "C#",
      ".NET",
      "SQL Server"
    ],
    "image": "/media/bus-management-symbol-v4.png",
    "imageFit": "contain",
    "isFeatured": false,
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/CaoNhatLinh/Bus-management_.Net"
      }
    ],
    "gallery": [
      {
        "src": "/media/bus-management-booking-flow-v3.png",
        "alt": "Bus Management — route, seat selection, passenger details, and booking confirmation concept"
      }
    ],
    "outcome": {
      "vi": "Tôi xây màn hình đặt vé kết hợp thông tin chuyến, chọn ghế và nhập hành khách. Dự án giúp tôi thực hành xử lý dữ liệu nghiệp vụ trong ứng dụng C#/.NET.",
      "en": "I built a booking screen combining trip details, seat selection, and passenger entry. The project gave me practice handling business data in a C#/.NET application."
    },
    "proofLinks": [
      {
        "label": "Case study",
        "href": "/work/bus-management"
      }
    ],
    "highlights": [
      {
        "title": {
          "vi": "Phân biệt trạng thái ghế",
          "en": "Seat availability"
        },
        "detail": {
          "vi": "Sơ đồ ghế phân biệt ghế trống, ghế đang chọn và ghế đã đặt. Người dùng có thể xem ngay vị trí mình chọn mà không phải đối chiếu với một bảng khác.",
          "en": "The seat map distinguishes available, selected, and booked seats, so users can review their choice without checking a separate table."
        }
      },
      {
        "title": {
          "vi": "Chọn chuyến trước, nhập sau",
          "en": "Trip selection before entry"
        },
        "detail": {
          "vi": "Tôi đặt thông tin tuyến, thời gian và sơ đồ ghế trước phần hành khách. Khi đổi chuyến, người dùng cần kiểm tra lại ghế; không nên tiếp tục với lựa chọn của chuyến cũ.",
          "en": "Route, time, and seat selection come before passenger details. Changing a trip means reviewing the seats again rather than keeping an old selection."
        }
      },
      {
        "title": {
          "vi": "Kiểm tra trước khi lưu vé",
          "en": "Checks before saving"
        },
        "detail": {
          "vi": "Ghế, chuyến xe và hành khách là các dữ liệu liên quan. Tôi chú ý đến việc kiểm tra đầu vào và trạng thái đặt vé trước khi lưu, thay vì chỉ xử lý từng textbox riêng lẻ.",
          "en": "Seats, trips, and passengers are related records. I focus on input and booking-state checks before saving, rather than treating each textbox separately."
        }
      }
    ],
    "sections": [
      {
        "heading": {
          "vi": "Bài toán của đồ án",
          "en": "The coursework problem"
        },
        "body": {
          "vi": "Một vé xe không chỉ có tên và số điện thoại. Nó phải gắn với đúng chuyến, thời gian và ghế. Tôi làm đồ án này để thực hành giao diện đặt vé và tổ chức dữ liệu bằng C#/.NET, SQL Server. Đây không phải hệ thống đang bán vé cho một nhà xe thực tế.",
          "en": "A ticket involves more than a name and phone number: it belongs to a trip, time, and seat. I built this coursework project to practice booking interfaces and data organization with C#/.NET and SQL Server. It is not a live ticketing system for a bus operator."
        },
        "tone": "light"
      },
      {
        "heading": {
          "vi": "Cách tôi tổ chức luồng đặt vé",
          "en": "The booking flow"
        },
        "body": {
          "vi": "Người dùng chọn tuyến và chuyến, xem ghế còn trống, rồi nhập thông tin hành khách cho ghế đã chọn. Tôi đưa sơ đồ ghế và thông tin chuyến lên trước để có thể kiểm tra lựa chọn trước khi nhập. Khi lưu vé, phần giao diện và dữ liệu phải dùng đúng chuyến và trạng thái ghế tương ứng.",
          "en": "Users choose a route and trip, select available seats, then enter passenger details. The trip information and seat map come first so the selection can be checked before entry. Saving a ticket must use the corresponding trip and seat state."
        },
        "tone": "dark"
      },
      {
        "heading": {
          "vi": "Điều tôi học được",
          "en": "What I learned"
        },
        "body": {
          "vi": "Tôi học cách đi từ một yêu cầu nghiệp vụ đến form và dữ liệu liên quan, thay vì bắt đầu bằng việc đặt thật nhiều ô nhập lên màn hình. Nếu phát triển tiếp cho nhiều người đặt cùng lúc, tôi cần kiểm tra thêm transaction và ràng buộc ở database để tránh bán trùng ghế; giao diện báo ghế trống thôi là chưa đủ.",
          "en": "I learned to translate a workflow into a form and related records instead of starting with a screen full of inputs. For concurrent booking, the next step would be checking database transactions and constraints to prevent duplicate seat sales; showing an available seat in the UI alone is not enough."
        },
        "tone": "accent"
      }
    ]
  }
];

export { richArticles as articles };

export const getLocale = (value?: string): Locale =>
  value === "en" ? "en" : "vi";

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
