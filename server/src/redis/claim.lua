-- Atomic claim. KEYS: [1]=cooldown key, [2]=board hash, [3]=leaderboard zset, [4]=dirty set
-- ARGV: [1]=idx, [2]=playerId, [3]=color, [4]=cooldownMs
-- Returns: {'ok', prevOwnerId|''} or {'cooldown', ttlMs} or {'self'}

local ttl = redis.call('PTTL', KEYS[1])
if ttl > 0 then
  return { 'cooldown', ttl }
end

local prev = redis.call('HGET', KEYS[2], ARGV[1])
local prevOwner = ''
if prev then
  prevOwner = string.match(prev, '^([^|]+)')
  if prevOwner == ARGV[2] then
    return { 'self' }
  end
end

redis.call('HSET', KEYS[2], ARGV[1], ARGV[2] .. '|' .. ARGV[3])
redis.call('ZINCRBY', KEYS[3], 1, ARGV[2])
if prevOwner ~= '' then
  local left = redis.call('ZINCRBY', KEYS[3], -1, prevOwner)
  if tonumber(left) <= 0 then
    redis.call('ZREM', KEYS[3], prevOwner)
  end
end
redis.call('SET', KEYS[1], '1', 'PX', ARGV[4])
redis.call('SADD', KEYS[4], ARGV[1])

return { 'ok', prevOwner }
