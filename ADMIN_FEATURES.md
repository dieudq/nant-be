# Admin Features Spec

Tai lieu nay tong hop cac chuc nang can co de xay dung trang Admin cho Nanny Marketplace.

## 1) Muc tieu trang Admin

- Quan ly van hanh he thong marketplace cho `WORKER`, `FAMILY`, `BOOKING`, `PAYMENT`.
- Duyet ho so va kiem soat compliance.
- Xu ly su co, theo doi doanh thu, bao cao va audit.

## 2) Dashboard (bat buoc)

- KPI tong quan:
  - Tong so user
  - Tong worker dang hoat dong
  - Worker cho duyet
  - Booking hom nay / tuan nay
  - Ti le huy booking
  - Tong doanh thu va platform fee
- Operational alerts:
  - Worker thieu document
  - Booking qua han chua confirm
  - Payment failed / pending lau
- Quick actions:
  - Duyet worker pending
  - Xem booking can can thiep

## 3) User Management

- Danh sach user (phan trang + tim kiem + filter role/status).
- Xem chi tiet user.
- Cap nhat role (`ADMIN`, `WORKER`, `FAMILY`).
- Khoa / mo khoa tai khoan.
- Xem lich su hoat dong co ban.

## 4) Worker Operations

- Danh sach worker + filter theo:
  - verification status
  - training status
  - rating
  - job type
- Worker pending queue:
  - Approve / Reject worker
  - Luu ly do reject
- Worker profile review:
  - languages, services, rate, availability
  - references, intro videos, profile photo
- Document verification:
  - Duyet/reject tung document
  - Tracking expiry va yeu cau bo sung

## 5) Family Operations

- Danh sach family + thong tin tre em.
- Xem profile chi tiet:
  - allergies
  - special requirements
  - preferences
- Kiem tra lich su booking cua family.

## 6) Booking Management

- Danh sach booking (filter theo status/date/family/worker).
- Chi tiet booking:
  - timeline
  - notes
  - payment
  - shift report
- Cap nhat trang thai booking khi can can thiep:
  - confirm
  - cancel
  - complete
  - no-show

## 7) Payments and Revenue

- Danh sach payments.
- Tracking payment status:
  - pending
  - completed
  - failed
  - refunded
- Breakdown:
  - total amount
  - platform fee
  - worker payout
- Bao cao doanh thu theo ngay/tuan/thang.

## 8) Reviews and Moderation

- Danh sach reviews theo worker/family.
- Moderation:
  - an review vi pham
  - danh dau spam
  - ghi ly do moderation
- Theo doi chi so quality worker.

## 9) Compliance, Training, Interview

- Compliance center:
  - Queue ho so can duyet
  - Trang thai KYC/background/drug screen
- Training:
  - Danh sach ket qua training attempts
  - Pass/fail (>= 80)
- Interview:
  - Lich phong van 2:1
  - Ket qua interview
  - Notes

## 10) Contract Management

- Tao va quan ly contract.
- Theo doi contract acceptance 3 ben.
- Activate / terminate contract.
- Luu lich su thay doi contract.

## 11) Incident and Dispute

- Tao ticket su co/dispute.
- Gan voi booking/payment/review lien quan.
- Ghi ket qua xu ly va huong boi thuong.

## 12) Role and Permission (RBAC)

- Quyen theo module:
  - User
  - Worker approval
  - Booking
  - Payment
  - Compliance
  - Settings
- Muc role de xuat:
  - `SUPER_ADMIN`
  - `OPS_ADMIN`
  - `FINANCE_ADMIN`
  - `COMPLIANCE_ADMIN`

## 13) Audit Log

- Luu ai lam gi, khi nao, o dau.
- Bat buoc log voi action nhay cam:
  - approve/reject worker
  - role change
  - payment update
  - contract update

## 14) Cac man hinh UI de xay

- Dashboard
- Users
- Workers
  - Pending approvals
  - Documents verification
  - Training/Interview
- Families
- Bookings
- Payments
- Reviews
- Contracts
- Disputes
- Audit logs
- Settings

## 15) MVP rollout de xay nhanh

### P0 (can co ngay)
- Dashboard co ban
- User list + block/unblock
- Worker pending approval
- Booking list/detail

### P1
- Payment list + revenue breakdown
- Shift report viewer
- Review moderation
- Compliance documents queue

### P2
- Contract workflow day du
- Dispute management
- RBAC chi tiet + Audit log day du

## 16) API readiness checklist cho Admin FE

- Auth:
  - login admin
  - me
- Users:
  - list/detail/update role/status
- Workers:
  - pending list
  - approve/reject
  - documents list/create/verify
  - training attempts
  - interviews
- Bookings:
  - list/detail
  - update status
  - shift report
- Payments:
  - list/status/breakdown
- Reviews:
  - list/moderate
- Contracts:
  - create/list/detail/accept/activate
- Audit:
  - list events

---

Neu can, co the tach file nay thanh user stories + acceptance criteria cho tung man hinh de team FE/BE sprint theo task.

