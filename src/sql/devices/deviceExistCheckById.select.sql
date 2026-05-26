select id, device_id, user_id, pairing_status
from user_devices
where device_id = ?
and user_id = ?
and pairing_status = 1;