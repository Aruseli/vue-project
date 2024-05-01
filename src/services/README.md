Services and stores directories are in the middle of refactoring:
- move from services+stores to single services directory
- move from kioskState to smaller components (terminal, users, etc.)

...
- services:
  - /api/
  - /documents/
    - documents
    - arrivals
    - inventories (объединяем с selective-inventory)
    - orders
  - /local-hardware/
    - barcodes
    - print
    - local-device-ws
    - event-emitter (потом перенесём, если где-то ещё будем пользоваться)
  - /config
  - /user - выделяем из app store
  - /terminal - выделяем из app store
  - /goods
  - /cart
  - /locales - докидываем из app store
  - /tracking
  - /shifts
  - /utils
