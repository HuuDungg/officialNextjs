import { useEffect, useState } from "react"

const useHasMounted = () => {
    const [hasMount, setHasMount] = useState<boolean>(false)
    useEffect(() => {
        setHasMount(true)
    }, [])
    return hasMount;
}

export default useHasMounted