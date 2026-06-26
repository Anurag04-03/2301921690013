# Stage 1

## Approach to Sorting the Priority Inbox
For the Priority Inbox, the notifications are prioritized based on a composite key of `Weight` and `Recency`.
- **Weight**: Notifications are weighted according to their type: `Placement` (3) > `Result` (2) > `Event` (1).
- **Recency**: When weights are equal, the `Timestamp` is compared to ensure more recent notifications rank higher.

In the implemented script, we sort the initial batch of notifications using this priority logic and return the top `n` elements.

## Efficiently Maintaining the Top 10 for Streaming Notifications
As new notifications continuously arrive, appending to an array and re-sorting the entire list each time is inefficient with a time complexity of `O(N log N)`.

To maintain the top 10 efficiently in a real-time system, the best approach is to use a **Min-Heap (Priority Queue) of size k** (where $k=10$):

1. **Initial Population**: Insert the first $k$ notifications into the min-heap. The heap is ordered using our priority logic (Weight first, then Recency), but in *reverse* so that the **lowest priority** element among the top $k$ is at the root of the heap.
2. **Streaming Updates**: 
   - When a new notification arrives, we compare it to the root of the min-heap (which represents the least important notification currently in our top 10).
   - If the new notification has a **higher priority** than the root, we remove the root (`extract-min`) and insert the new notification.
   - If the new notification has a lower priority than the root, we simply discard it.
3. **Time Complexity**: Comparing takes `O(1)` time. If an insertion is needed, extracting the minimum and inserting a new element in a heap of size $k$ takes `O(log k)` time. Since $k$ is a small constant (10), this operation takes `O(1)` time per new notification, making it extremely fast.
4. **Space Complexity**: The heap only stores $k$ elements, so it takes `O(k)` space (constant space). 

This approach ensures the top 10 notifications are maintained dynamically and efficiently without needing to perform large array sorts or database queries.
